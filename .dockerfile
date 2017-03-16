FROM node:latest
# Create app directory
RUN mkdir -p /var/www/node/seemless
WORKDIR /var/www/node/seemless
# Install app dependencies
COPY . /var/www/node/seemless
RUN npm install > /dev/null
EXPOSE 80
CMD [ "npm", "start" ]
