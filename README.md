# Real-Time Deepfake Video Detection System

A production-grade, full-stack AI application that processes videos frame-by-frame in real time to detect deepfake content. The system combines pretrained CNN inference with forensic verification techniques, providing explainable results through a modern React interface backed by a scalable Node.js microservice architecture.

## 🏗️ Architecture

The system follows a microservice architecture with the following components:

- **Frontend (React + TypeScript)**: Real-time video upload interface with live processing visualization
- **Backend API (Node.js + Express)**: RESTful API with WebSocket support for real-time communication
- **AI Inference Service (Python + Flask)**: Pretrained CNN model deployment for frame-level deepfake detection
- **Forensic Verification Engine (Node.js)**: Rule-based verification using multiple forensic techniques
- **Shared Types Package**: TypeScript interfaces and types shared across all services

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Python 3.9+
- Docker & Docker Compose (optional)

### Development Setup

1. **Clone and setup the project:**
   ```bash
   git clone <repository-url>
   cd deepfake-video-detector
   npm run setup
   ```

2. **Install dependencies:**
   ```bash
   npm run install:all
   ```

3. **Start all services:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - AI Service: http://localhost:5000
   - Forensic Engine: http://localhost:5001



## 📁 Project Structure

```
deepfake-video-detector/
├── packages/
│   ├── frontend/          # React frontend application
│   ├── backend/           # Node.js Express API server
│   ├── ai-service/        # Python Flask AI inference service
│   ├── forensic-engine/   # Node.js forensic verification service
│   └── shared/            # Shared TypeScript types and interfaces
├── scripts/               # Development setup scripts
├── models/                # AI model files (created during setup)
├── uploads/               # Video upload directory (created during setup)
├── docker-compose.yml     # Docker services configuration
└── package.json           # Root package configuration
```

## 🛠️ Available Scripts

### Root Level Scripts

- `npm run dev` - Start all services in development mode
- `npm run build` - Build all packages for production
- `npm run test` - Run tests for all packages
- `npm run setup` - Setup development environment
- `npm run docker:build` - Build Docker containers
- `npm run docker:up` - Start Docker services
- `npm run docker:down` - Stop Docker services
- `npm run clean` - Clean all build artifacts and node_modules

### Individual Service Scripts

Each package has its own scripts accessible via:
- `cd packages/<service-name> && npm run <script>`

## 🔧 Configuration

### Environment Variables

Each service has its own `.env` file created from `.env.example`:

**Backend (.env)**
```
PORT=3001
FRONTEND_URL=http://localhost:3000
AI_SERVICE_URL=http://localhost:5000
FORENSIC_SERVICE_URL=http://localhost:5001
MONGODB_URI=mongodb://localhost:27017/deepfake-detector
REDIS_URL=redis://localhost:6379
```

**AI Service (.env)**
```
PORT=5000
MODEL_PATH=/app/models/deepfake_detector.pth
BATCH_SIZE=8
MAX_WORKERS=4
FLASK_ENV=development
```

**Forensic Engine (.env)**
```
PORT=5001
MAX_FRAME_SEQUENCE=60
OPENCV_THREADS=4
```

## 🧪 Testing

The project uses Vitest for testing across all TypeScript packages and includes both unit tests and property-based tests.

```bash
# Run all tests
npm run test

# Run tests for specific package
cd packages/shared && npm test
cd packages/frontend && npm test
cd packages/backend && npm test
cd packages/forensic-engine && npm test
```

## 🐳 Docker Support

The project includes full Docker support with hot reloading for development:

- **Frontend**: React development server with Vite
- **Backend**: Node.js with tsx watch mode
- **AI Service**: Python Flask with auto-reload
- **Forensic Engine**: Node.js with tsx watch mode
- **Database Services**: MongoDB and Redis

## 📚 API Documentation

### Health Check Endpoints

All services provide health check endpoints:
- Backend: `GET /health`
- AI Service: `GET /health`
- Forensic Engine: `GET /health`

### WebSocket Events

The backend provides WebSocket support for real-time updates:
- `join_session` - Join a processing session
- `processing_update` - Receive real-time processing updates

## 🔍 Key Features

- **Real-Time Processing**: Frame-by-frame streaming analysis
- **Hybrid Detection**: AI + forensic verification
- **Explainable Results**: Frame-wise confidence scores and anomaly highlighting
- **Microservice Architecture**: Independently scalable components
- **Production Ready**: Monitoring, logging, error handling
- **Hot Reloading**: Full development environment with live reload
- **Type Safety**: Comprehensive TypeScript interfaces across all services

## 🤝 Development Workflow

1. **Make changes** to any service
2. **Hot reloading** automatically updates the running service
3. **Shared types** are automatically rebuilt and updated
4. **Tests** can be run individually or across all packages
5. **Docker** environment mirrors local development

## 📝 Next Steps

After setup completion, you can:

1. **Implement core functionality** by following the tasks in `.kiro/specs/deepfake-video-detector/tasks.md`
2. **Add AI models** to the `models/` directory
3. **Customize configuration** in environment files
4. **Extend the API** by adding new endpoints
5. **Enhance the UI** with additional React components

## 🏷️ Version

Current version: 1.0.0

---

This project demonstrates industry-standard practices for building scalable, real-time AI applications with modern web technologies. The system combines pretrained CNN inference with forensic verification techniques, providing explainable results through a modern React interface backed by a scalable Node.js microservice architecture.

## Architecture

The system consists of four main services:

- **Frontend** (React + TypeScript): Real-time video upload interface with live processing visualization
- **Backend** (Node.js + Express): RESTful API with WebSocket support for real-time communication
- **AI Service** (Python + Flask): Pretrained CNN model inference service
- **Forensic Engine** (Node.js + OpenCV): Advanced forensic verification algorithms

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.9+
- Docker Desktop (Required for Databases)

### Development Setup (Hybrid Workflow)

1. **Install dependencies:**
   ```bash
   npm run install:all
   ```

2. **Start Databases (Redis & MongoDB):**
   ```bash
   docker-compose up -d redis mongodb
   ```

3. **Start Application Services:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - AI Service: http://localhost:5000
   - Forensic Engine: http://localhost:5001

### Full Docker Setup (Optional)
If you prefer to run *everything* in Docker (no local Node/Python needed):

1. **Build and start all services:**
   ```bash
   npm run docker:build
   npm run docker:up
   ```

## Project Structure

```
deepfake-video-detector/
├── packages/
│   ├── shared/           # Shared TypeScript types and interfaces
│   ├── frontend/         # React application
│   ├── backend/          # Node.js Express API server
│   ├── ai-service/       # Python AI inference service
│   └── forensic-engine/  # Node.js forensic verification service
├── docker-compose.yml    # Docker orchestration
└── package.json         # Monorepo configuration
```

## Development Commands

- `npm run dev` - Start all services in development mode
- `npm run build` - Build all packages
- `npm run test` - Run all tests
- `npm run docker:build` - Build Docker images
- `npm run docker:up` - Start Docker containers
- `npm run docker:down` - Stop Docker containers

## Features

- **Real-Time Processing**: Frame-by-frame streaming analysis
- **Hybrid Detection**: AI inference + forensic verification
- **Explainable Results**: Frame-wise confidence scores and anomaly highlighting
- **Production Architecture**: Containerized microservices with monitoring
- **Modern Stack**: React, Node.js, Python, TypeScript, Docker

## License

MIT License