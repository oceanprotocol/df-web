FROM node:lts AS dfweb
WORKDIR /dfweb
COPY . .
RUN npm install
RUN npm run build
CMD ["npm","start"]