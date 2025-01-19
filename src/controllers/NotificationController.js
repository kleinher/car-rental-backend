const logger = require('../config/logger');
const { processFirstMessage } = require('../service/UpdateService');
const { sendNotificationService } = require('../service/NotificationService');

async function sendNotification(req, res) {
    try {
        const { number, message, licencePlate } = req.body;

        if (!number || !message || !licencePlate) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        await sendNotificationService(number, message);
        await processFirstMessage(number, licencePlate);

        res.status(200).json({ success: true, message: 'Notification sent successfully' });
    } catch (error) {
        logger.error('Error sending notification:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


module.exports = { sendNotification };
