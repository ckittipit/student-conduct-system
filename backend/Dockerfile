FROM node:20-slim

WORKDIR /app

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY . .
ARG DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ENV DATABASE_URL=$DATABASE_URL

RUN npx prisma generate
RUN npm run build

# debug — แสดงว่า dist มีอะไรบ้าง
RUN ls -la dist/ || echo "dist not found"
RUN find . -name "main.js" 2>/dev/null || echo "main.js not found"

EXPOSE 4000
CMD ["node", "dist/main"]