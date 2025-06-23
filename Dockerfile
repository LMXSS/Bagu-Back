# Etapa 1: build da aplicação
FROM node:18-alpine AS builder

WORKDIR /app

# Copia os arquivos necessários
COPY yarn.lock package.json ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# Etapa 2: imagem de produção
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./

EXPOSE 3000

CMD ["node", "dist/main"]
