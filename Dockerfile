# Use an official Node.js image as the base image (alpine variant for smaller size)
FROM node:18-alpine as build

# Install build dependencies for bcrypt and other native modules
RUN apk add --no-cache make gcc g++ python3

# Set the working directory inside the container
WORKDIR /usr/src/app

# Change ownership of the working directory
RUN chown -R node:node /usr/src/app

# Switch to the 'node' user for security
USER node

# Copy the package.json and package-lock.json files
COPY --chown=node:node package*.json ./

# Install dependencies using npm ci for clean install
RUN npm ci && npm cache clean --force

# Rebuild bcrypt from source to ensure compatibility with the environment
RUN npm rebuild bcrypt --build-from-source

# Copy the rest of the application code
COPY --chown=node:node . .

# Expose the port your app runs on
EXPOSE 3000

# Run the application in development mode
CMD ["npm", "run", "dev"]
