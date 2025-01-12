const client = require('../client/whatsapp');
const logger = require('../config/logger'); // Asegúrate de tener configurado tu logger

const sendNotification = async (number, message, res) => {
    try {
        const chatId = `${number}@c.us`; // Formato de ID de WhatsApp
        await client.sendMessage(chatId, message);

        logger.info('Mensaje enviado:', message);
        res.status(200).json({ success: true, message: 'Mensaje enviado' });
    } catch (error) {
        logger.error('Error al enviar mensaje:', error);
        res.status(500).json({ success: false, message: 'Error al enviar mensaje' });
    }
};

module.exports = {
    sendNotification
};