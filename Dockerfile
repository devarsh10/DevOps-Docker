# Stage 1: Build
FROM node:20 AS builder

WORKDIR /app

COPY package.json .

RUN npm i

COPY . . 

# Stage 2: Production Image

FROM node:alpine

# Creating a new directory named app
WORKDIR /app

#Copying all the content copied in app to current directory
COPY --from=builder /app .

# Exposing port which will be mapped with the host's port.
EXPOSE 3000

CMD [ "npm", "start" ]