const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const logger = require('../config/logger');
const { sendQr, sendOk, setClientNotReady } = require('../websocket/WebSocketServer');
const qrcodeIther = require('qrcode');


const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: "./sessions"
    }),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

function initializeWppClient() {
    client.initialize();

    client.on('qr', async (qr) => {
        qrcode.generate(qr, { small: true });
        const qrImage = await qrcodeIther.toDataURL(qr);
        logger.info('QR Code generated');
        sendQr(qrImage);
    });

    client.on('ready', async () => {
        logger.info('Cliente listo');
        sendOk();
    });

    client.on('auth_failure', (msg) => {
        logger.error('Authentication failure:', msg);
        setClientNotReady();
    });

    client.on('disconnected', (reason) => {
        logger.info('Client was logged out', reason);
        setClientNotReady();
    });

    client.on('error', (error) => {
        logger.info('Client error:', error);
        setClientNotReady();
    });

    client.on('message', async (message) => {
        const senderNumber = message.from.split('@')[0];
        const { processUserMessage } = require('../service/UpdateService'); // Carga diferida
        await processUserMessage(senderNumber, message.hasMedia, message.body);
    });
}


module.exports = { client, initializeWppClient };
