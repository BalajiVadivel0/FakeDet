# Local Development Setup (No Docker)

This guide will help you set up and run the Deepfake Video Detection System locally without Docker.

## Prerequisites

- **Node.js 18+** (for frontend, backend, and forensic engine)
- **Python 3.9+** (for AI service)
- **MongoDB** (local installation or MongoDB Atlas)
- **Redis** (local installation or Redis Cloud)
- **FFmpeg** (for video processing)

## Quick Setup

### 1. Install Dependencies

```bash
# Install root dependencies and all package dependencies
npm run install:all
```

### 2. Setup Environment

```bash
# Run the setup script to create .env files and directories
npm run setup
```

### 3. Configure Environment Variables

The setup script creates `.env` files from `.env.example` templates. Update them for local development:

**packages/backend/.env:**
```env
PORT=3001
FRONTEND_URL=http://localhost:3000
AI_SERVICE_URL=http://localhost:5000
FORENSIC_SERVICE_URL=http://localhost:5001
MONGODB_URI=mongodb://localhost:27017/deepfake-detector
REDIS_URL=redis://localhost:6379
```

**packages/ai-service/.env:**
```env
PORT=5000
MODEL_PATH=./models/deepfake_detector.pth
BATCH_SIZE=8
MAX_WORKERS=4
FLASK_ENV=development
```

**packages/forensic-engine/.env:**
```env
PORT=5001
MAX_FRAME_SEQUENCE=60
OPENCV_THREADS=4
```

### 4. Install Python Dependencies

```bash
cd packages/ai-service
pip install -r requirements.txt
cd ../..
```

### 5. Setup Local Services

#### MongoDB
- **Option 1**: Install MongoDB locally
  - Windows: Download from [MongoDB Community Server](https://www.mongodb.com/try/download/community)
  - Start: `mongod --dbpath ./data/db`

- **Option 2**: Use MongoDB Atlas (cloud)
  - Create free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
  - Update `MONGODB_URI` in `packages/backend/.env`

#### Redis
- **Option 1**: Install Redis locally
  - Windows: Use [Redis for Windows](https://github.com/microsoftarchive/redis/releases)
  - Start: `redis-server`

- **Option 2**: Use Redis Cloud
  - Create free instance at [Redis Cloud](https://redis.com/try-free/)
  - Update `REDIS_URL` in `packages/backend/.env`

#### FFmpeg
- Download from [FFmpeg](https://ffmpeg.org/download.html)
- Add to system PATH

### 6. Start All Services

```bash
# Start all services concurrently
npm run dev
```

This will start:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- AI Service: http://localhost:5000
- Forensic Engine: http://localhost:5001

### 7. Verify Setup

Visit http://localhost:3000 to access the application.

Check service health:
- Backend: http://localhost:3001/health
- AI Service: http://localhost:5000/health
- Forensic Engine: http://localhost:5001/health

## Individual Service Commands

If you prefer to start services individually:

```bash
# Frontend
npm run dev:frontend

# Backend
npm run dev:backend

# AI Service
npm run dev:ai-service

# Forensic Engine
npm run dev:forensic-engine
```

## Build for Production

```bash
# Build all packages
npm run build
```

## Testing

```bash
# Run all tests
npm run test

# Test individual packages
npm run test:frontend
npm run test:backend
npm run test:forensic-engine
npm run test:shared
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: Make sure ports 3000, 3001, 5000, 5001 are available
2. **MongoDB connection**: Ensure MongoDB is running and accessible
3. **Redis connection**: Ensure Redis is running and accessible
4. **Python dependencies**: Make sure all Python packages are installed
5. **FFmpeg**: Ensure FFmpeg is installed and in PATH

### Service Dependencies

Services should start in this order:
1. MongoDB and Redis (external services)
2. AI Service and Forensic Engine
3. Backend API
4. Frontend

The `npm run dev` command handles this automatically with proper dependency management.

## Development Tips

- Use `npm run clean` to clean all build artifacts and node_modules
- Environment files are gitignored - never commit actual .env files
- The `temp/` and `uploads/` directories are created automatically
- Models will be downloaded automatically when the AI service starts