FROM alpine:3.1

# Update
RUN apk add --update nodejs

# Install app dependencies
COPY package.json /src/package.json
RUN cd /src; npm install

# Bundle app source
COPY . /src

EXPOSE 8080

CMD [ "node", "/src/examples/app.js" ]
# CMD ["node", "/src/index.js"]


# #FROM node:latest
# FROM alpine:3.1
# # Create app directory
# RUN apk add --update nodejs
# #RUN mkdir -p /var/www/node/seemless
# WORKDIR /var/www/node/seemless
# # Install app dependencies
# COPY . /var/www/node/seemless
# RUN npm install --silent > /dev/null
# CMD [ "npm", "start" ]
