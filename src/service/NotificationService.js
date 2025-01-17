const logger = require('../config/logger'); // Asegúrate de tener configurado tu logger

const { sendMessage } = require('../client/WhatsappClient');
async function sendNotificationService(number, message) {
    try {
        const chatId = `${number}@c.us`; // Formato de ID de WhatsApp
        await sendMessage(chatId, message);

        logger.info('Mensaje enviado:' + message);
    } catch (error) {
        logger.error('Error al enviar mensaje:' + error);
    }
}

module.exports = { sendNotificationService };