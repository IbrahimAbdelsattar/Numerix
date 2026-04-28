# NumeriX — Numerical Analysis Virtual Lab

> Solve, visualize, and master every numerical method. From root-finding races to 3D convergence trajectories — numerical analysis reimagined.

![NumeriX](https://img.shields.io/badge/NumeriX-v1.0.0-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat-square&logo=fastapi)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript)

## ✨ Features

| Feature | Description |
|---|---|
| **Solver Lab** | Step-by-step execution of 9 numerical methods |
| **AI Tutor** | 4 AI modes: Tutor, Solver, Debug, Viva |
| **Race Mode** | Run all root-finding methods simultaneously |
| **3D Visualizer** | Animated convergence trajectories |
| **Error Geometry** | Interactive error visualization lab |
| **Learn Hub** | Per-method deep dives with live sliders |
| **Quiz Mode** | Test your numerical analysis knowledge |
| **Whiteboard** | Freehand drawing for working out problems |
| **Newton Fractals** | Explore fractal basins of attraction |
| **PDF Export** | Generate professional solution sheets |

## 🏗 Architecture

```
numerix/
├── src/                    # React + TypeScript frontend
│   ├── components/         # Reusable UI components
│   ├── pages/              # Route pages
│   ├── lib/                # Utilities & numerical methods
│   └── state/              # App context
├── backend/                # FastAPI Python backend
│   ├── main.py             # API server + SPA serving
│   ├── models.py           # SQLAlchemy models
│   └── database.py         # DB engine + session
├── Dockerfile              # Multi-stage production build
├── docker-compose.yml      # One-command deployment
├── start.bat               # Dev launcher (Windows)
└── start-production.bat    # Production launcher (Windows)
```

## 🚀 Quick Start (Development)

### Prerequisites
- **Node.js** ≥ 18
- **Python** ≥ 3.10
- **npm** (comes with Node.js)

### 1. Clone & Install

```bash
git clone https://github.com/your-org/numerix.git
cd numerix

# Frontend
npm install

# Backend
pip install -r backend/requirements.txt
```

### 2. Configure Environment

```bash
# Frontend (optional — only if using Supabase)
cp .env.example .env

# Backend (required for AI features)
cp backend/.env.example backend/.env
# Edit backend/.env and set your OPENROUTER_API_KEY
```

### 3. Run

**Windows:**
```bash
start.bat
```

**Manual (any OS):**
```bash
# Terminal 1 — Backend
python backend/main.py

# Terminal 2 — Frontend
npm run dev
```

Open [http://localhost:8080](http://localhost:8080)

## 🏭 Production Deployment

### Option A: Docker (Recommended)

```bash
# Configure production secrets
cp .env.example .env
# Edit .env and set OPENROUTER_API_KEY, SECURITY_SECRET, FRONTEND_ORIGIN, TRUSTED_HOSTS

# Build and run
docker compose up --build -d

# View logs
docker compose logs -f numerix
```

The app will be available at `http://localhost:8080`.

### Option B: Windows Production Script

```bash
start-production.bat
```

This builds the frontend, runs `backend/preflight.py`, sets `PRODUCTION=true`, and starts a unified server.

### Option C: Manual Production Build

```bash
# 1. Build frontend
npm run build

# 2. Set environment
export PRODUCTION=true
export PORT=8080
export OPENROUTER_API_KEY=sk-or-v1-your-key
export SECURITY_SECRET=$(python -c "import secrets; print(secrets.token_urlsafe(48))")
export FRONTEND_ORIGIN=https://your-domain.com
export TRUSTED_HOSTS=your-domain.com

# 3. Start server
cd backend
python main.py
```

### Option D: Cloud Run

```bash
gcloud run deploy numerix \
  --source . \
  --set-env-vars PRODUCTION=true,OPENROUTER_API_KEY=sk-or-v1-your-key \
  --allow-unauthenticated
```

## ⚙️ Environment Variables

### Frontend (`.env`)
| Variable | Required | Description |
|---|---|---|
| `VITE_SUPABASE_URL` | No | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | No | Supabase anon key |

### Backend (`backend/.env`)
| Variable | Required | Default | Description |
|---|---|---|---|
| `OPENROUTER_API_KEY` | **Yes** | — | OpenRouter API key for AI features |
| `SECURITY_SECRET` | **Production** | — | Encryption/signing secret, at least 32 characters |
| `MODEL` | No | `meta-llama/llama-3.1-8b-instruct:free` | AI model identifier |
| `PRODUCTION` | No | `false` | Enable production mode |
| `PORT` | No | `8088` | Server port |
| `WORKERS` | No | `1` | Uvicorn worker count |
| `DATABASE_URL` | No | `sqlite:///./data/numerix.db` | Database connection URL |
| `FRONTEND_ORIGIN` | No | `http://localhost:8080` | CORS origin (production) |
| `TRUSTED_HOSTS` | No | — | Comma-separated allowed hosts |
| `LOG_LEVEL` | No | `INFO` | Logging level |
| `MAX_REQUEST_BYTES` | No | `1048576` | Maximum HTTP request body size |

## 🧪 Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Type checking
npm run typecheck

# Linting
npm run lint
```

## 📋 Production Checklist

- [x] All branding updated (no placeholder text)
- [x] Environment variables externalized
- [x] API keys never committed to git
- [x] CORS restricted in production
- [x] API docs disabled in production
- [x] SQLite WAL mode for concurrent performance
- [x] Multi-stage Docker build (minimal image)
- [x] Non-root container user
- [x] Health check endpoint (`/api/health`)
- [x] Docker health checks configured
- [x] Structured logging
- [x] Global exception handler
- [x] Message length limits
- [x] Request body size limits
- [x] Security headers and HSTS
- [x] Production preflight validation
- [x] Readiness endpoint (`/api/ready`)
- [x] Agent isolation, prompt firewall, and output filtering
- [x] Session-scoped access control and encrypted sensitive storage
- [x] Context window truncation (40 messages)
- [x] Dependency versions pinned
- [x] Production chunk splitting (vendor caching)
- [x] Graceful error handling for AI timeouts
- [x] `.env.example` templates provided

See [docs/PRODUCTION.md](docs/PRODUCTION.md) for the full deployment runbook.

## 📄 License

MIT © NumeriX Team
