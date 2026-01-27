FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY packages/ai-service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install development dependencies
RUN pip install --no-cache-dir watchdog

# Copy source code
COPY packages/ai-service/ .

# Create models directory
RUN mkdir -p /app/models

# Expose port
EXPOSE 5000

# Start application with auto-reload for development
CMD ["python", "-u", "app.py"]