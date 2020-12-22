FROM node:15.4-slim

RUN mkdir /app
WORKDIR /app

COPY package.json /app
RUN npm install --only=prod
COPY app.js /app/app.js
COPY public /app/public
COPY routes /app/routes
COPY views /app/views
COPY models /app/models
COPY middleware /app/middleware

ENV NODE_ENV production
ENV PORT 3000

EXPOSE 3000

CMD ["npm", "start"]
