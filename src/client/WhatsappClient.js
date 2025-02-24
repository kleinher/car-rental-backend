const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const logger = require('../config/logger');
const { setQr, sendQr, sendOk, setClientNotReady } = require('../websocket/WebSocketServer');
const qrcodeIther = require('qrcode');
require("dotenv").config();
const { parseVCard } = require('./VCard');

const ADMINISTRADORES = ["34645983954", "34645408152", "5492262651624"];

const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: process.env.SESSION_PATH
    }),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
        ]
    },
    webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.3000.1018902222-alpha.html'
    }

});

function initializeWppClient() {
    client.initialize();

    client.on('qr', async (qr) => {
        setClientNotReady();
        qrcode.generate(qr, { small: true });
        const qrImage = await qrcodeIther.toDataURL(qr);
        logger.info('QR Code generated');
        setQr(qrImage);
        sendQr();
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
        const { processUserMessage } = require('../service/UpdateService');
        await processUserMessage(senderNumber, message.hasMedia, message.body);
        if (message.type === 'vcard') {
            const contactSenderNumber = message.from.replace('@c.us', '');
            if (ADMINISTRADORES.includes(contactSenderNumber)) {
                let contactInfo = parseVCard(message.body);
                logger.info('Datos extraídos de la vCard:' + JSON.stringify(contactInfo, null, 2));
            } else {
                logger.warn(`El número ${contactSenderNumber} no está autorizado para enviar vCards:`);
            }
        }
    });
}


module.exports = { client, initializeWppClient };
