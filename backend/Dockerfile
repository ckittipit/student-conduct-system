FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate
RUN npm run build

RUN npm prune --omit=dev

EXPOSE 4000
CMD ["npm", "run", "start:prod"]
