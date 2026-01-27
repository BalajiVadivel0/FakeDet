FROM node:18-alpine

WORKDIR /app

# Copy package files for shared dependencies
COPY packages/shared/package*.json ../shared/
COPY packages/shared/src ../shared/src
COPY packages/shared/tsconfig.json ../shared/

# Copy forensic engine package files
COPY packages/forensic-engine/package*.json ./

# Install dependencies
RUN npm install
RUN cd ../shared && npm install && npm run build

# Copy source code
COPY packages/forensic-engine/ .

# Expose port
EXPOSE 5001

# Start development server with hot reloading
CMD ["npm", "run", "dev"]