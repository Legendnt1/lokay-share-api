# 1. Imagen base ligera de Node.js
FROM node:20-alpine

# 2. Establecer el directorio de trabajo
WORKDIR /usr/src/app

# 3. Copiar archivos de dependencias
COPY package*.json ./

# 4. Instalar dependencias
RUN npm install

# 5. Copiar el resto de los archivos de la aplicación
COPY . .

# 6. Exponer el puerto en el que corre la app
EXPOSE 3000

# 7. Comando para iniciar la aplicación
# Usamos 'npm run dev' para aprovechar nodemon y el hot-reload del volumen
CMD ["npm", "run", "dev"]
