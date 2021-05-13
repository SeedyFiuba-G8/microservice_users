FROM node:14

WORKDIR /usr/src/app

RUN apt-get -y update
RUN apt-get -y apt-utils
RUN apt-get -y install postgresql-client

COPY . .

RUN npm install
RUN npm run build
# Eventualmente esto tiene que ser RUN npm ci

# Ports
EXPOSE 3000

# Waiting for db to start accepting connections...
CMD sh dev/wait-for-postgres.sh $DATABASE_URL node build/index.js
