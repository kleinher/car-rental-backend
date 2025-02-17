FROM node:18

# Instalar dependencias para Chromium/Puppeteer
RUN apt-get update && apt-get install -y \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libxss1 \
    libxshmfence1 \
    libgtk-3-0 \
    libasound2 \
    fonts-liberation \
    wget \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Crear usuario no-root
RUN useradd -ms /bin/bash pptruser
USER pptruser

RUN npm install wscat

# Probar conexión a WebSocket
RUN wscat -c wss://web.whatsapp.com/ws || echo "No se pudo conectar a WhatsApp WebSocket"

# Lanzar tu app
CMD ["npm", "start"]
