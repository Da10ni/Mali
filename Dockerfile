# Use the official Node.js image
FROM node:22 AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Ensure prisma schema is copied (make sure the prisma folder exists in your project)
COPY prisma ./prisma

# Generate Prisma Client
RUN npx prisma generate

# Copy all source files
COPY . .

# Build the application
RUN npm run build

# Expose the port
EXPOSE 3000

# Run the application
CMD ["npm", "start"]
