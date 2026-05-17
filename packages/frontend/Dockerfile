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

# Build for production
RUN npm run build

# Expose port
EXPOSE 3000

# Serve production build
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]