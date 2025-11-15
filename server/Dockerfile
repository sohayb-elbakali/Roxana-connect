# Use Node.js LTS version
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create directory for uploaded images
RUN mkdir -p public/images

# Expose the port (Railway will use the PORT environment variable)
EXPOSE 5000

# Start the application
CMD ["node", "server.js"]
