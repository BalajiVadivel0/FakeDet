#!/bin/bash

echo "Setting up Deepfake Video Detection System development environment..."

# Create environment files if they don't exist
if [ ! -f packages/backend/.env ]; then
    cp packages/backend/.env.example packages/backend/.env
    echo "Created backend .env file"
fi

if [ ! -f packages/ai-service/.env ]; then
    cp packages/ai-service/.env.example packages/ai-service/.env
    echo "Created ai-service .env file"
fi

if [ ! -f packages/forensic-engine/.env ]; then
    cp packages/forensic-engine/.env.example packages/forensic-engine/.env
    echo "Created forensic-engine .env file"
fi

# Create models directory
mkdir -p models
echo "Created models directory"

# Create uploads directory
mkdir -p uploads
echo "Created uploads directory"

echo "Development environment setup complete!"
echo ""
echo "Next steps:"
echo "1. Run 'npm install' to install dependencies"
echo "2. Run 'npm run dev' to start all services"
echo "3. Open http://localhost:3000 in your browser"