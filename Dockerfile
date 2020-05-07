FROM node:10

#App Directory
WORKDIR /usr/src/app

#Install dependencies
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000
CMD [ "node", "app.js" ]
