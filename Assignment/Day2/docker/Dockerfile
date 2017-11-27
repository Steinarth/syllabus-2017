FROM node:carbon

WORKDIR /code

COPY package.json package.json
COPY app.js app.js
RUN npm install
CMD node app.js
