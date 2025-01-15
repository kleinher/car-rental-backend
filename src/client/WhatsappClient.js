const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const logger = require('../config/logger');
const { updateDataWithCache } = require('../service/UpdateService');

class WhatsappClient {
    constructor() {
        this.client = new Client({
            authStrategy: new LocalAuth(),
        });

        this.initialize();
    }

    initialize() {
        this.client.on('qr', (qr) => {
            qrcode.generate(qr, { small: true });
        });

        this.client.on('ready', () => {
            console.log('Cliente listo');
        });

        this.client.on('message', async (message) => {
            const senderNumber = message.from.split('@')[0];
            updateDataWithCache(senderNumber, message.body);
        });

        this.client.initialize();
    }
}

module.exports = new WhatsappClient();
