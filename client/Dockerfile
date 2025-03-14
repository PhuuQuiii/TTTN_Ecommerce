# Use Node.js Latest LTS version
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Expose the port
ENV PORT=3000
EXPOSE 3000

# Start the application
CMD ["npm", "start"] 