FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the code
COPY . .

# Build the app
RUN npm run build

# Expose port
EXPOSE 3000

# Set WebSocket URL environment variable
ENV NEXT_PUBLIC_WS_URL=ws://ai-service:8001

# Start the app
CMD ["npm", "start"]