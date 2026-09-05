# 🚀 AI Project Manager

<div align="center">
  <p>A high-performance, AI-powered Project Management System mimicking Azure DevOps/Jira aesthetics. Built to streamline project workflows with real-time collaboration and AI task generation.</p>
</div>

---

## 🌟 Key Features

- **🤖 AI-Powered Task Generation**: Automatically generate actionable project tasks from a single goal using **Groq API** and the **Llama 3** model.
- **⚡ Real-Time Collaboration**: Websocket integration for live updates across teams.
- **🏢 Multi-Tenancy Support**: Robust tenant isolation using `TenantMiddleware` and organization IDs.
- **📋 Kanban Board Interface**: Drag-and-drop task management built with `@dnd-kit`.
- **🎨 Modern Aesthetics**: Azure DevOps / Jira inspired UI using **Tailwind CSS**.

---

## 🛠️ Tech Stack & Skills Applied

### **Frontend**
- **Framework**: React 18 with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Interactions**: `@dnd-kit` for drag-and-drop mechanics
- **Icons**: Lucide React

### **Backend**
- **Framework**: FastAPI (Python 3.11+)
- **Database**: SQLite (Development) / PostgreSQL (Production)
- **ORM**: SQLAlchemy (Async)
- **Data Validation**: Pydantic
- **AI Integration**: Groq API (LLaMA 3: `llama3-8b-8192`)
- **Real-Time**: WebSockets

---

## 📂 Project Structure

```text
ai-project-manager/
├── backend/                  # Python FastAPI Backend
│   ├── app/
│   │   ├── api/              # API Endpoints (REST & WebSockets)
│   │   ├── core/             # Configuration & AI Service Logic
│   │   ├── db/               # Database Setup & Migrations
│   │   ├── models/           # SQLAlchemy Models
│   │   └── schemas/          # Pydantic Validation Schemas
│   ├── main.py               # Application Entry Point
│   └── requirements.txt      # Python Dependencies
│
└── frontend/                 # React Vite Frontend
    ├── public/               # Static Assets
    ├── src/                  # React Components & Hooks
    ├── package.json          # Node Dependencies
    ├── tailwind.config.js    # Tailwind configuration
    └── vite.config.ts        # Vite build configuration
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.11+
- Node.js 18+
- Groq API Key (for AI features)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a `.env` file (refer to `.env example`) and add your Groq API key:
   ```env
   GROQ_API_KEY=your_api_key_here
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the server:
   ```bash
   uvicorn main:app --reload
   ```
   *API Documentation available at: http://localhost:8000/docs*

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *Application available at: http://localhost:3000*

---

## 🧠 AI Integration Details

This project leverages the **Groq API** to provide instantaneous, intelligent task breakdown. 
- **Model**: `llama3-8b-8192`
- **Functionality**: Users input a broad project goal, and the AI service (`backend/app/core/ai_service.py`) returns a structured JSON array of actionable tasks complete with estimated hours and priority levels. 
- **Resilience**: Includes a deterministic fallback mechanism to ensure uninterrupted workflow if the AI service is temporarily unavailable.

---

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.
