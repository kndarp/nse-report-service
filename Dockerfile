FROM node:8

# Create Installation Directory
RUN mkdir -p /usr/src/microservices/
WORKDIR /usr/src/microservices/

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install
# RUN npm install --only=production

# Bundle app source
COPY . /usr/src/microservices/

EXPOSE 3000

CMD [ "npm", "start" ]

