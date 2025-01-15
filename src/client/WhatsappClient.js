const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const logger = require('../config/logger');
const UpdateService = require('../service/UpdateService');

class WhatsappClient {
    constructor() {
        this.client = new Client({
            authStrategy: new LocalAuth(),
        });

        this.updateService = UpdateService;
        this.initialize();
    }

    initialize() {
        this.client.initialize();

        this.client.on('qr', (qr) => {
            qrcode.generate(qr, { small: true });
        });

        this.client.on('ready', () => {
            console.log('Cliente listo');
        });

        this.client.on('auth_failure', (msg) => {
            console.error('Authentication failure:', msg);
        });

        this.client.on('disconnected', (reason) => {
            console.log('Client was logged out', reason);
        });

        this.client.on('error', (error) => {
            console.error('Client error:', error);
        });

        this.client.on('message', async (message) => {
            const senderNumber = message.from.split('@')[0];
            this.updateService.updateDataWithCache(senderNumber, message.body);
        });


    }
}

module.exports = new WhatsappClient();
