FROM node:18-alpine

WORKDIR /app

# Copy package files for shared dependencies
COPY packages/shared/package*.json ../shared/
COPY packages/shared/src ../shared/src
COPY packages/shared/tsconfig.json ../shared/

# Copy backend package files
COPY packages/backend/package*.json ./

# Install dependencies
RUN npm install
RUN cd ../shared && npm install && npm run build

# Copy source code
COPY packages/backend/ .

# Build
RUN npm run build

# Expose port
EXPOSE 3001

# Start production server
CMD ["npm", "start"]