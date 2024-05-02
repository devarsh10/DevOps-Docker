FROM node:slim

WORKDIR /app

COPY package.json .

RUN npm install && \
    npm install -g nodemon

COPY . /app

EXPOSE 5000

CMD [ "node", "app.js" ]