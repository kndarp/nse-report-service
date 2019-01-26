FROM node:8

# Create Installation Directory
RUN mkdir /usr/src/microservices/
WORKDIR /usr/src/microservices/

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install
# RUN npm install --only=production

# Bundle app source
COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]

