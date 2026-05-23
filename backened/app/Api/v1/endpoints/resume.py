from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services.extractor import TextExtractor
from app.services.analyzer import ResumeAnalyzer
from app.models.user import UserTable
from app.models.resume import ResumeTable
from app.models.analysis import AnalysisResultTable
from app.schemas.resume import ResumeCreate
from app.schemas.analysis import AnalysisResultCreate
import uuid

router = APIRouter()
analyzer = ResumeAnalyzer()

@router.post("/analyze")
async def analyze_resume(
    file: UploadFile = File(...),
    job_description: str = Form(...),
    user_id: str = Form(...),
    email: str = Form(...),
    db: Session = Depends(get_db)
):
    try:
        content = await file.read()
        resume_text = TextExtractor.extract(content, file.filename)
        
        if not resume_text:
            raise HTTPException(status_code=400, detail="Could not extract text from file")

        analysis = analyzer.calculate_score(resume_text, job_description)

        # Ensure user exists in local DB (especially for Google users from Supabase)
        user = db.query(UserTable).filter(UserTable.id == user_id).first()
        if not user:
            # Create a shell user record if it doesn't exist locally but comes from Supabase
            # Since we don't have the password, we use a placeholder or null
            new_user = UserTable(
                id=user_id,
                email=email, 
                hashed_password="EXTERNAL_AUTH_USER" 
            )
            db.add(new_user)
            db.flush() # Flush to ensure ID is available for FKs

        # 1. Validate and Store Resume in DB
        resume_id = str(uuid.uuid4())
        resume_in = ResumeCreate(
            filename=file.filename,
            content=resume_text,
            user_id=user_id
        )
        db_resume = ResumeTable(
            id=resume_id,
            **resume_in.model_dump()
        )
        db.add(db_resume)
        db.flush() # Flush to ensure resume_id is available for analysis FKs
        
        # Determine pass/fail based on score (e.g., > 70)
        is_passed = analysis['score'] >= 70

        # 2. Validate and Store Analysis Result in DB
        analysis_id = str(uuid.uuid4())
        analysis_in = AnalysisResultCreate(
            user_id=user_id,
            resume_id=resume_id,
            jd_text=job_description,
            ats_score=analysis['score'],
            missing_skills=analysis['missing_skills'],
            match_level=analysis['match_level'],
            is_passed=is_passed
        )
        db_analysis = AnalysisResultTable(
            id=analysis_id,
            **analysis_in.model_dump()
        )
        db.add(db_analysis)
        db.commit()
        db.refresh(db_analysis)

        # Merge analysis result with is_passed for frontend
        analysis['is_passed'] = is_passed

        return {
            "status": "success",
            "data": analysis
        }

    except Exception as e:
        db.rollback()
        print(f"Error in analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/analytics/{user_id}")
async def get_analytics(user_id: str, db: Session = Depends(get_db)):
    try:
        results = db.query(AnalysisResultTable) \
            .filter(AnalysisResultTable.user_id == user_id) \
            .order_by(AnalysisResultTable.created_at.desc()) \
            .limit(10) \
            .all()
        
        return {
            "status": "success",
            "data": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
@router.get("/check-email/{email}")
async def check_email(email: str, db: Session = Depends(get_db)):
    try:
        user = db.query(UserTable).filter(UserTable.email == email).first()
        return {
            "status": "success",
            "exists": user is not None
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
