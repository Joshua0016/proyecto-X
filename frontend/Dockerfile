FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173

#--host para que Docker pueda acceder
CMD ["npm", "run", "dev", "--", "--host"]