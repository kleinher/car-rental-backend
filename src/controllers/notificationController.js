const logger = require('../config/logger');
const client = require('../client/whatsapp');

exports.sendNotification = async (req, res) => {
    const { number, message } = req.body;

    try {
        const chatId = `${number}@c.us`; // Formato de ID de WhatsApp
        await client.sendMessage(chatId, message);
        logger.info('Mensaje enviado:',);
        res.status(200).json({ success: true, message: 'Mensaje enviado' });
    } catch (error) {
        logger.error('Error al enviar mensaje:', error);
        res.status(500).json({ success: false, message: 'Error al enviar mensaje' });
    }
}
