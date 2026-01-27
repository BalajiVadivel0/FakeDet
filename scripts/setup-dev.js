#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('Setting up Deepfake Video Detection System development environment...\n');

// Function to copy file if it doesn't exist
function copyEnvFile(source, destination) {
  if (!fs.existsSync(destination)) {
    fs.copyFileSync(source, destination);
    console.log(`✓ Created ${destination}`);
  } else {
    console.log(`- ${destination} already exists`);
  }
}

// Function to create directory if it doesn't exist
function createDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✓ Created ${dirPath} directory`);
  } else {
    console.log(`- ${dirPath} directory already exists`);
  }
}

try {
  // Create environment files
  console.log('Setting up environment files:');
  copyEnvFile('packages/backend/.env.example', 'packages/backend/.env');
  copyEnvFile('packages/ai-service/.env.example', 'packages/ai-service/.env');
  copyEnvFile('packages/forensic-engine/.env.example', 'packages/forensic-engine/.env');

  console.log('\nCreating required directories:');
  // Create required directories
  createDirectory('models');
  createDirectory('uploads');
  createDirectory('temp');

  console.log('\n✅ Development environment setup complete!\n');
  console.log('Next steps:');
  console.log('1. Run "npm run install:all" to install all dependencies');
  console.log('2. Run "npm run dev" to start all services');
  console.log('3. Open http://localhost:3000 in your browser');
  console.log('\nFor Docker development:');
  console.log('1. Run "npm run docker:build" to build containers');
  console.log('2. Run "npm run docker:up" to start all services');
  console.log('3. Run "npm run docker:logs" to view logs');

} catch (error) {
  console.error('❌ Error setting up development environment:', error.message);
  process.exit(1);
}