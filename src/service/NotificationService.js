const WhatsappClient = require('../client/WhatsappClient');
const logger = require('../config/logger'); // Asegúrate de tener configurado tu logger

class NotificationService {
    async sendNotification(number, message) {
        try {
            const chatId = `${number}@c.us`; // Formato de ID de WhatsApp
            await WhatsappClient.client.sendMessage(chatId, message);

            logger.info('Mensaje enviado:' + message);
        } catch (error) {
            logger.error('Error al enviar mensaje:' + error);
        }
    }
}

module.exports = new NotificationService();