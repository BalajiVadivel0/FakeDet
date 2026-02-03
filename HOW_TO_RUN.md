# How to Run FakeDet

This guide provides step-by-step instructions to run the **FakeDet** application locally without Docker.

## 1. Prerequisites
Ensure you have the following installed:
*   **Node.js** (v18+)
*   **Python** (v3.9+)
*   **MongoDB Community Server** (installed and running)
*   **Redis** (installed and running)

---

## 2. Start Databases
Since you are not using Docker, you must ensure your local database services are running.

1.  **MongoDB**: Ensure the MongoDB service is started (usually starts automatically on Windows).
2.  **Redis**: Start the Redis server.
    *   *Windows*: If using Memurai or a Redis port, ensure the service is active.

**Verify they are running:**
Frontend/Backend rely on:
*   MongoDB: `mongodb://localhost:27017`
*   Redis: `redis://localhost:6379`

---

## 3. Run Application Services
Once the databases are up, you can start the application services.

### Option A: Run Everything (Recommended)
Starts Frontend, Backend, AI Service, and Forensic Engine in parallel.
```powershell
npm run dev
```
*   **Frontend**: [http://localhost:3000](http://localhost:3000)
*   **Backend**: [http://localhost:3001](http://localhost:3001)

### Option B: Run Individually (For Debugging)
Open 4 separate terminal tabs:

**1. Backend API**
```powershell
npm run dev:backend
```

**2. AI Service** (Python)
```powershell
cd packages/ai-service
# Activate venv first: .\.venv\Scripts\Activate.ps1
python app.py
```

**3. Forensic Engine**
```powershell
npm run dev:forensic-engine
```

**4. Frontend UI**
```powershell
npm run dev:frontend
```

---

## 4. Troubleshooting
*   **"ECONNREFUSED 127.0.0.1:6379"**: Redis is not running. Start your local Redis server.
*   **"connect ECONNREFUSED 127.0.0.1:27017"**: MongoDB is not running. Check your Windows Services.
*   **"Python not found"**: Try using `py` instead of `python` in the AI Service.
*   **"Modules not found"**: Run `npm install:all` in the root directory.
