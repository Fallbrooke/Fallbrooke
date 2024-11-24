# Use the official Node.js image as the base image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application's code to the working directory
COPY . ./

# Expose port 3000 to the host
EXPOSE 3000

# Start the React application
CMD ["npm", "start"]
