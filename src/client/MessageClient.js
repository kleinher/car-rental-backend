const { client } = require('./WhatsappClient');

async function sendMessage(number, message) {
    logger.info(`Enviando mensaje por wpp cliente: ${client}`)
    const chatId = `${number}@c.us`;
    return client.sendMessage(chatId, message);
}

module.exports = {
    sendMessage,
};
