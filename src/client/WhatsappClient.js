const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const logger = require('../config/logger');
const { updateDataWithCache } = require('../service/UpdateService');

const client = new Client({
    authStrategy: new LocalAuth(),
});

function initialize() {
    client.initialize();

    client.on('qr', (qr) => {
        qrcode.generate(qr, { small: true });
    });

    client.on('ready', () => {
        console.log('Cliente listo');
    });

    client.on('auth_failure', (msg) => {
        console.error('Authentication failure:', msg);
    });

    client.on('disconnected', (reason) => {
        console.log('Client was logged out', reason);
    });

    client.on('error', (error) => {
        console.error('Client error:', error);
    });

    client.on('message', async (message) => {
        const senderNumber = message.from.split('@')[0];
        updateDataWithCache(senderNumber, message.body);
    });
}

async function sendMessage(number, message) {
    return client.sendMessage(number, message);
}

initialize();

module.exports = { client, sendMessage };
