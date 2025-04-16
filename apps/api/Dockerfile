###################
# BUILD FOR PRODUCTION
###################

FROM node:20.10.0 AS build

WORKDIR /app

# Copiar el proyecto
COPY . .

#Instalar dependencias y generarlo
RUN npm ci && npm run build:all && npm cache clean --force

###################
# PRODUCTION
###################

#Paso 2: Despliegue
FROM node:20.10.0

WORKDIR /app

# Copiar los archivos contruidos en el paso anterior de producción
COPY --from=build /app/package.json .
COPY --from=build /app/dist ./dist
COPY --from=build /app/pm2.json .

#Despliegue en servidor de aplicaciones PM2
RUN npm install --production && npm install pm2 --location=global