const { client } = require('./WhatsappClient');
const logger = require('../config/logger'); // Asegúrate de tener configurado tu logger

async function sendMessage(number, message) {
    logger.info(`📨 Intentando enviar mensaje a ${number}`);

    logger.info("Client estado" + await client.getState())
    if (!client || !client.info || !client.info.wid) {
        logger.error("❌ El cliente de WhatsApp no está conectado.");
        throw new Error("El cliente de WhatsApp no está autenticado.");
    }

    const chatId = `${number}@c.us`;
    try {
        logger.info(`✅ Cliente de WhatsApp conectado. Enviando mensaje...`);
        await client.sendMessage(chatId, message);
        logger.info(`📩 Mensaje enviado a ${number}`);
    } catch (error) {
        logger.error(`❌ Error enviando mensaje: ${error.message}`);
        throw error;
    }
}

module.exports = { sendMessage };
