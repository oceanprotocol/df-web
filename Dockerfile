FROM node:lts AS dfweb
WORKDIR /dfweb
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3005
CMD ["npm", "start"]