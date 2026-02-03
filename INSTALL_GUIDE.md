# FakeDet Installation Guide

This guide describes how to set up the **FakeDet** project from scratch on a new machine (Windows/Linux/Mac).

## 1. Prerequisites

Ensure you have the following installed on your system:
*   **Node.js** (v18 or higher)
*   **Python** (v3.9 or higher)
*   **Git**
*   **Docker Desktop** (Recommended for running databases easier)

## 2. Initial Setup

1.  **Clone the Repository**
    ```bash
    git clone <repository-url>
    cd FakeDet
    ```

2.  **Install Root Tools**
    Install the scripts needed to run the project setup.
    ```bash
    npm install
    ```

3.  **Run Setup Script**
    This script automatically creates necessary `.env` configuration files and folders (`uploads`, `temp`, `models`).
    ```bash
    npm run setup
    ```

## 3. Configuration (Critical Step)

The default configuration is set up for Docker. **If you are running the AI Service locally (not in Docker), you must edit its configuration.**

1.  Open `packages/ai-service/.env` in a text editor.
2.  Locate the line starting with `MODEL_PATH`.
3.  **Delete it** or **comment it out** (add `#` at the start).
    *   *Why?* The default path (`/app/models/...`) is for Docker. By removing it, the system will automatically download the correct model from Hugging Face on the first run.

    **Example `packages/ai-service/.env`:**
    ```ini
    PORT=5000
    # MODEL_PATH=/app/models/deepfake_detector.pth  <-- Commented out
    BATCH_SIZE=8
    MAX_WORKERS=4
    FLASK_ENV=development
    ```

## 4. Install Dependencies

### 4.1 JavaScript/TypeScript Services
Install dependencies for Frontend, Backend, and Forensic Engine via the root script:
```bash
npm run install:all
```

### 4.2 AI Service (Python)
You need to manually set up the Python environment for the AI service.

**Windows (PowerShell):**
```powershell
cd packages/ai-service
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
cd ../..
```

**Mac/Linux:**
```bash
cd packages/ai-service
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cd ../..
```

## 5. Start Databases

## 5. Start Databases

Since you are not using Docker, you need to have **MongoDB** and **Redis** installed and running on your local machine.

### 5.1 MongoDB
1.  Download and install **MongoDB Community Server**.
2.  Ensure the MongoDB service is running (Port `27017`).
    *   **Windows**: Check "Services" app for `MongoDB Server`.

### 5.2 Redis
1.  Download the **free native Windows port** of Redis.
    *   **Link**: [https://github.com/tporadowski/redis/releases](https://github.com/tporadowski/redis/releases)
    *   **File**: Download `Redis-x64-5.0.14.1.msi` (or latest `.msi`).
2.  Run the installer.
    *   Ensure "Add the Redis installation folder to the PATH environment variable" is checked.
    *   Ensure the port is set to `6379`.
3.  Once installed, the service usually starts automatically.

> **Verify**: Open a new terminal and type `redis-cli ping`. If it replies `PONG`, you are ready.

## 6. Run the Application

Now you can start all services (Frontend, Backend, AI Service, Forensic Engine) with a single command:

```bash
npm run dev
```

*   **Frontend**: [http://localhost:3000](http://localhost:3000)
*   **Backend API**: [http://localhost:3001](http://localhost:3001)

### Troubleshooting
*   **"Python not found"**: If `npm run dev` fails to start the AI service, ensure Python is in your system PATH.
*   **"Model download failed"**: On the first run, the AI Service will download a large model (~gigabytes). Ensure you have a stable internet connection.
