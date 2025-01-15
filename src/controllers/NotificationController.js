const logger = require('../config/logger');
const notificationService = require('../service/NotificationService');
const { setDataWithCache } = require('../service/updateService');

class NotificationController {
    constructor() {
        this.notificationService = notificationService;
    }

    async sendNotification(req, res) {
        try {
            const { number, message, licencePlate } = req.body;

            if (!number || !message || !licencePlate) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            await notificationService.sendNotification(number, message);
            await setDataWithCache(number, licencePlate);

            res.status(200).json({ success: true, message: 'Notification sent successfully' });
        } catch (error) {
            logger.error('Error sending notification:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}


module.exports = new NotificationController();
