FROM node:18-alpine

WORKDIR /app

# Copy package files for shared dependencies
COPY packages/shared/package*.json ../shared/
COPY packages/shared/src ../shared/src
COPY packages/shared/tsconfig.json ../shared/

# Copy frontend package files
COPY packages/frontend/package*.json ./

# Install dependencies
RUN npm install
RUN cd ../shared && npm install && npm run build

# Copy source code
COPY packages/frontend/ .

# Expose port
EXPOSE 3000

# Start development server with hot reloading
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]