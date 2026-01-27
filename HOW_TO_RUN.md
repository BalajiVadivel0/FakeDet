# How to Run FakeDet

This guide provides step-by-step instructions to run the **FakeDet** application using the **Hybrid Workflow** (Docker for Databases, Local for Services).

## 1. Prerequisites
Ensure you have the following installed:
*   **Node.js** (v18+)
*   **Python** (v3.9+)
*   **Docker Desktop** (used only for running MongoDB & Redis easily)

---

## 2. Start Databases (First Step)
Before running the application, you must start MongoDB and Redis. The easiest way is to run them as lightweight containers:

1.  Open a terminal in the project root.
2.  Run:
    ```powershell
    docker-compose up -d redis mongodb
    ```
3.  Verify they are running:
    ```powershell
    docker-compose ps
    ```
    *(You should see `fakedet-redis-1` and `fakedet-mongodb-1` with status "Up")*

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
py app.py
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
*   **"ECONNREFUSED 127.0.0.1:6379"**: Redis is not running. Run `docker-compose up -d redis`.
*   **"Python not found"**: Try using `py` instead of `python` in the AI Service.
*   **"Modules not found"**: Run `npm install` in the root directory.
