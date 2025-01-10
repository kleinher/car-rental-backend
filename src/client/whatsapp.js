const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const logger = require('../config/logger');

// Crear el cliente
const client = new Client({
    authStrategy: new LocalAuth(), // Guarda la sesión de forma local
});

// Escuchar eventos
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Cliente listo');
});

client.on('message', (message) => {
    console.log('Mensaje recibido:', message.body);
});



module.exports = client;
