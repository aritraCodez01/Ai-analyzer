import re
import httpx
import logging
import time
import os
import math
from collections import Counter
from app.core.config import settings

logger = logging.getLogger(__name__)

class ResumeAnalyzer:
    def __init__(self, model_name: str = 'all-MiniLM-L6-v2'):
        self.model_name = model_name
        self.model = None  # Lazy-loaded only if fallback to local is needed

    def preprocess_text(self, text: str) -> str:
        # Lowercase and remove extra whitespace
        text = text.lower()
        text = re.sub(r'\s+', ' ', text).strip()
        return text

    def calculate_lightweight_similarity(self, text1: str, text2: str) -> float:
        # Tokenize words (lowercase, alphanumeric only, length >= 3)
        words1 = re.findall(r'\b\w{3,}\b', text1.lower())
        words2 = re.findall(r'\b\w{3,}\b', text2.lower())
        
        if not words1 or not words2:
            return 0.0
            
        vec1 = Counter(words1)
        vec2 = Counter(words2)
        
        intersection = set(vec1.keys()) & set(vec2.keys())
        dot_product = sum(vec1[x] * vec2[x] for x in intersection)
        
        sum1 = sum(vec1[x]**2 for x in vec1.keys())
        sum2 = sum(vec2[x]**2 for x in vec2.keys())
        
        denominator = math.sqrt(sum1) * math.sqrt(sum2)
        
        if not denominator:
            return 0.0
        return dot_product / denominator

    def calculate_score(self, resume_text: str, jd_text: str) -> dict:
        resume_clean = self.preprocess_text(resume_text)
        jd_clean = self.preprocess_text(jd_text)

        ats_score = None
        
        # 1. Try Hugging Face Inference API if token is configured
        if settings.HF_TOKEN:
            try:
                logger.info("Attempting to calculate score using Hugging Face Inference API...")
                url = f"https://api-inference.huggingface.co/models/sentence-transformers/{self.model_name}"
                headers = {"Authorization": f"Bearer {settings.HF_TOKEN}"}
                payload = {
                    "inputs": {
                        "source_sentence": jd_clean,
                        "sentences": [resume_clean]
                    }
                }
                
                retries = 3
                for attempt in range(retries):
                    try:
                        with httpx.Client() as client:
                            response = client.post(url, headers=headers, json=payload, timeout=15.0)
                        
                        if response.status_code == 200:
                            scores = response.json()
                            if isinstance(scores, list) and len(scores) > 0:
                                cosine_score = float(scores[0])
                                ats_score = round(cosine_score * 100, 2)
                                logger.info(f"Successfully calculated score from HF API: {ats_score}")
                                break
                            elif isinstance(scores, dict) and "estimated_time" in scores:
                                wait_time = min(float(scores.get("estimated_time", 2.0)), 5.0)
                                logger.info(f"Model is loading, waiting {wait_time}s (attempt {attempt + 1}/{retries})...")
                                time.sleep(wait_time)
                            else:
                                logger.warning(f"Unexpected response format from HF API: {scores}")
                                break
                        elif response.status_code == 503:
                            try:
                                error_data = response.json()
                                wait_time = min(float(error_data.get("estimated_time", 3.0)), 5.0)
                            except Exception:
                                wait_time = 3.0
                            logger.info(f"HF API 503 (loading), waiting {wait_time}s (attempt {attempt + 1}/{retries})...")
                            time.sleep(wait_time)
                        else:
                            logger.warning(f"HF API returned status code {response.status_code}: {response.text}")
                            break
                    except httpx.RequestError as req_err:
                        logger.warning(f"Network error on attempt {attempt + 1}: {req_err}")
                        if attempt == retries - 1:
                            raise req_err
                        time.sleep(1.0)
            except httpx.RequestError as req_err:
                logger.warning(f"Hugging Face Inference API is offline or unreachable: {req_err}. Falling back to local/lightweight model.")
            except Exception as e:
                logger.error(f"Failed to use Hugging Face Inference API: {e}", exc_info=True)

        # 2. Fallback
        if ats_score is None:
            is_render = os.environ.get("RENDER") == "true"
            
            if is_render:
                logger.info("Running on Render - falling back to lightweight TF-based similarity to avoid OOM...")
                try:
                    similarity = self.calculate_lightweight_similarity(resume_clean, jd_clean)
                    ats_score = round(similarity * 100, 2)
                    logger.info(f"Successfully calculated lightweight score: {ats_score}")
                except Exception as e:
                    logger.error(f"Failed lightweight similarity calculation: {e}", exc_info=True)
                    ats_score = 0.0
            else:
                logger.info("Falling back to local SentenceTransformer for calculation...")
                try:
                    # Lazy load local dependencies to prevent memory bloat on startup/API-based paths
                    from sentence_transformers import SentenceTransformer, util
                    import torch
                    
                    # Limit PyTorch CPU threads to save memory and CPU overhead
                    torch.set_num_threads(1)
                    
                    if self.model is None:
                        self.model = SentenceTransformer(self.model_name)
                        
                    # Generate embeddings
                    resume_embedding = self.model.encode(resume_clean, convert_to_tensor=True)
                    jd_embedding = self.model.encode(jd_clean, convert_to_tensor=True)

                    # Compute cosine similarity
                    cosine_score = util.cos_sim(resume_embedding, jd_embedding).item()
                    
                    # Scale score to 0-100
                    ats_score = round(cosine_score * 100, 2)
                    logger.info(f"Successfully calculated score locally: {ats_score}")
                except Exception as e:
                    logger.error(f"Failed local fallback calculation: {e}", exc_info=True)
                    ats_score = 0.0  # Fallback score on total failure

        # Simple keyword-based skill gap
        jd_keywords = set(re.findall(r'\b\w{3,}\b', jd_clean))
        resume_keywords = set(re.findall(r'\b\w{3,}\b', resume_clean))
        
        missing_skills = list(jd_keywords - resume_keywords)
        # Sort and limit missing skills for better UI
        missing_skills = sorted(missing_skills, key=len, reverse=True)[:10]

        return {
            "score": ats_score,
            "missing_skills": missing_skills,
            "match_level": self._get_match_level(ats_score)
        }

    def _get_match_level(self, score: float) -> str:
        if score >= 85: return "Excellent"
        if score >= 70: return "Good"
        if score >= 50: return "Average"
        return "Poor"
