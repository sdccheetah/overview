FROM node:latest
RUN mkdir /app
ADD . /app
WORKDIR /app
RUN npm install
RUN npm install mongo mongodb
EXPOSE 8000
EXPOSE 27017
RUN node server.js