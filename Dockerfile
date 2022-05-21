FROM node:lts AS dfweb
WORKDIR /dfweb
COPY . .
RUN npm install
RUN npm run build
EXPOSE 4005
CMD ["npm", "start"]
