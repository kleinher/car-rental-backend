const logger = require('../config/logger');
const notificationService = require('../service/notificationService');
const { setDataWithCache } = require('../service/updateService');
const express = require('express');
const notificationRouter = express.Router();

class NotificationController {
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

const notificationController = new NotificationController();
notificationRouter.post('/send', notificationController.sendNotification.bind(notificationController));

module.exports = { notificationRouter, NotificationController };
