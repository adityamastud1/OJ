# Use lightweight Node.js base image
FROM node:24-alpine

# Set working directory
WORKDIR /app

# Install g++, python3, openjdk, and other tools
RUN apk update && apk add --no-cache \
  g++ \
  python3 \
  py3-pip \
  openjdk17 \
  bash


# Copy all files to /app
COPY . .

# Install Node.js dependencies
RUN npm install

# Expose the compiler service port
EXPOSE 8000

# Start the service
CMD ["node", "index.js"]
