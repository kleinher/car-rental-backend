const client = require('../client/whatsapp');
const logger = require('../config/logger'); // Asegúrate de tener configurado tu logger

const sendNotification = async (number, message, res) => {
    try {
        const chatId = `${number}@c.us`; // Formato de ID de WhatsApp
        await client.sendMessage(chatId, message);

        logger.info('Mensaje enviado:' + message);
    } catch (error) {
        logger.error('Error al enviar mensaje:' + error);
    }
};

module.exports = {
    sendNotification
};