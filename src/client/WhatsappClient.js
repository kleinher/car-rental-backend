const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const logger = require('../config/logger');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

function initializeWppClient() {
    client.initialize();

    client.on('qr', (qr) => {
        qrcode.generate(qr, { small: true });
    });

    client.on('ready', () => {
        logger.info('Cliente listo');
    });

    client.on('auth_failure', (msg) => {
        logger.error('Authentication failure:', msg);
    });

    client.on('disconnected', (reason) => {
        logger.info('Client was logged out', reason);
    });

    client.on('error', (error) => {
        logger.info('Client error:', error);
    });

    client.on('message', async (message) => {
        const senderNumber = message.from.split('@')[0];
        const { processUserMessage } = require('../service/UpdateService'); // Carga diferida
        await processUserMessage(senderNumber, message.body);
    });
}


module.exports = { client, initializeWppClient };
