# backend/Dockerfile

FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install --only=production

# Copy app source
COPY . .

# Copy the .env file
COPY .env .env

# Expose backend port
EXPOSE 8080

# Start the app
CMD ["node", "src/app.js"]
