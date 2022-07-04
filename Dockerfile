FROM node:14-alpine
# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
# COPY run-all.sh ./
COPY tailwind.config.js ./
COPY tsconfig.json ./
COPY remix.config.js ./
COPY remix.env.d.ts ./

RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent

# add app
COPY . ./

# start app
CMD ["npm", "run","dev"]    