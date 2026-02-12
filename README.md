# AI Project Manager

## Overview
A high-performance, AI-powered Project Management System mimicking Azure DevOps/Jira aesthetics.
- **Backend**: FastAPI (Python 3.11) + SQLAlchemy (Async) + Multi-tenancy.
- **Frontend**: React (Vite) + TailwindCSS + Azure Design System.

## Prerequisites
- Python 3.11+
- Node.js 18+

## Quick Start

### Backend
1. Navigate to `backend/`
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the server:
   ```bash
   uvicorn main:app --reload
   ```
   API Docs: http://localhost:8000/docs/

### Frontend
1. Navigate to `frontend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
   UI: http://localhost:3000

## Architecture
- **Multi-tenancy**: Implemented via `TenantMiddleware` and `organization_id` checks.
- **Database**: SQLite (dev) / PostgreSQL (prod).
