const logger = require('../config/logger');
const client = require('../client/whatsapp');
const notificationService = require('../service/notificationService');

exports.sendNotification = async (req, res) => {
    const { number, message } = req.body;

    notificationService.sendNotification(number, message, res);
}
