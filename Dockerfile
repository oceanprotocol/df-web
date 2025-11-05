FROM node:25 AS dfweb
WORKDIR /dfweb
COPY . .
RUN npm install
RUN npm run build
CMD ["npm","start"]