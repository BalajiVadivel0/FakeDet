FROM python:3.9-slim

WORKDIR /app

# No system dependencies needed for opencv-python-headless

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

# Start application with gunicorn for production
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "2", "--timeout", "120", "app:app"]