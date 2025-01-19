const { client } = require('./WhatsappClient');

async function sendMessage(number, message) {
    const chatId = `${number}@c.us`;
    return client.sendMessage(chatId, message);
}

module.exports = {
    sendMessage,
};
