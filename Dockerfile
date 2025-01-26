# Use the base Alpine image with Node.js and npm support
FROM mcr.microsoft.com/devcontainers/base:alpine-3.20

# Set the working directory inside the container
WORKDIR /workspace

# Install necessary build dependencies
RUN apk update && \
    apk add --no-cache make gcc g++ python3 && \
    apk add --no-cache nodejs npm

# Install required npm packages
RUN npm install argon2 open
RUN npm install cors@2.8.5 dotenv@16.4.7 express-validator@7.2.1 express@4.21.2 jsonwebtoken@9.0.2 mongoose@8.9.5 nodemon@3.1.9

# Set the default user to 'root'
USER root

# Copy the setup script into the container
COPY .devcontainer/setup.sh /workspaces/wheelsonfire/.devcontainer/setup.sh

# Set up post-create command to run the setup script
RUN /bin/sh /workspaces/wheelsonfire/.devcontainer/setup.sh

# Expose a port if necessary (optional, depending on your application)
EXPOSE 8002

# Command to start the application (adjust this as needed)
CMD ["npm", "start"]
