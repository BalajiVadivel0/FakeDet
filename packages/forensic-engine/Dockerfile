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

# Build
RUN npm run build

# Expose port
EXPOSE 5001

# Start production server
CMD ["npm", "start"]