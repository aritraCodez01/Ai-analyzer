# 🚀 ResumeAI - AI Resume Analyzer

**ResumeAI** is a modern, full-stack application designed to help job seekers optimize their resumes through deep AI analysis. It identifies critical skill gaps, provides real-time ATS scoring, and visualizes career growth potential using a premium, dark-mode analytics dashboard.

## ✨ Key Features

- **🤖 AI Resume Engine**: Deep-scans resumes against job descriptions using `SentenceTransformers` to find missing keywords and hidden requirements.
- **📊 Real-Time Analytics**: Dynamic dashboard showing total analyses, average scores, and most frequent skill gaps across your target roles.
- **📈 Score Tracking**: Visualizes your ATS score trends over time to track your progress as you optimize your resume.
- **🛡️ Secure Auth**: Integrated with Supabase Auth (Email/Password & Google OAuth2) with custom email verification and password reset flows.
- **🌐 Cloud-Ready**: Fully containerized with Docker and optimized for instant deployment on platforms.

## 🛠️ Tech Stack

### **Backend**
- **Framework**: FastAPI (Python 3.11+)
- **AI Model**: `all-MiniLM-L6-v2` (SentenceTransformers)
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Migrations**: Alembic
- **Task Runner**: Uvicorn

### **Frontend**
- **Library**: React,typescript (with Vite)
- **Styling**: Vanilla CSS + Tailwind CSS (for layout),shadcn
- **Icons**: Lucide React
- **Authentication**: Supabase JS SDK

## 📁 Project Structure

```text
automation/
├── backened/           # FastAPI Backend Service
│   ├── app/            # Main application logic
│   ├── alembic/        # Database migrations
│   └── Dockerfile      # Production Docker configuration
└── frontened/          # React Frontend Application
    └── my-automation/  # Main React project
```

## 🚀 Getting Started

### **Backend Setup**
1. Navigate to the `backened/` folder.
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   .\venv\Scripts\activate  # Windows
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure `.env` with your Supabase credentials.
5. Startup the server:
   ```bash
   uvicorn app.main:app --reload
   ```

### **Frontend Setup**
1. Navigate to `frontened/my-automation/`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```

## 🚢 Deployment (Render)

The project includes a production-optimized `Dockerfile` that pre-downloads the AI model during the build stage. To deploy:
1. Push your code to GitHub.
2. Connect your repo to **Render** as a "Web Service".
3. Set the Root Directory to `backened/`.
4. Render will automatically use the `Dockerfile` to build and serve your AI engine!

## ⚙️ Supabase URL Configuration (For Authentication)

When deploying your frontend application, you must configure the redirect URLs in your Supabase project to ensure authentication (Google OAuth / Email) and password reset flows redirect properly:

1. Go to the **Supabase Dashboard** and select your project.
2. Navigate to **Authentication > URL Configuration**.
3. Under **Site URL**, set the URL of your deployed frontend (e.g., `https://your-app.vercel.app`).

---
*Created with ❤️

UI/UX
<img width="1899" height="909" alt="image" src="https://github.com/user-attachments/assets/23ec931d-f3fe-44eb-b27e-5b9815028475" />
<img width="1877" height="889" alt="image" src="https://github.com/user-attachments/assets/d20c78fe-9858-4dde-ba16-7a83be0c80f0" />


