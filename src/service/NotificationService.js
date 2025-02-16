const logger = require('../config/logger'); // Asegúrate de tener configurado tu logger

const { sendMessage } = require('../client/MessageClient');
async function sendNotificationService(number, message) {
    logger.info('Enviando mensaje a: ' + number);
    try {
        await sendMessage(number, message);

        logger.info('Mensaje enviado:' + message);
    } catch (error) {
        logger.error('Error al enviar mensaje:' + error);
    }
}

module.exports = { sendNotificationService };