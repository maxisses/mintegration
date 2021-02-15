FROM registry.access.redhat.com/ubi7/nodejs-12

WORKDIR /opt/app-root/src

COPY package.json /opt/app-root/src
RUN npm install --only=prod
COPY app.js /opt/app-root/src/app.js
COPY public /opt/app-root/src/public
COPY routes /opt/app-root/src/routes
COPY views /opt/app-root/src/views
COPY models /opt/app-root/src/models
COPY middleware /opt/app-root/src/middleware

ENV NODE_ENV production
ENV PORT 3000

EXPOSE 3000

CMD ["npm", "start"]
