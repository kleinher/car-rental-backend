const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const logger = require('../config/logger');
const { updateDataWithCache } = require('../service/updateService');
// Crear el cliente
const client = new Client({
    authStrategy: new LocalAuth(),
});

// Escuchar eventos
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Cliente listo');
});

client.on('message', async (message) => {
    const senderNumber = message.from.split('@')[0];
    updateDataWithCache(senderNumber, message.body);
});


module.exports = client;
