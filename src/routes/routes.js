const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/notificationController');

const notificationController = new NotificationController();

router.post('/send', notificationController.sendNotification.bind(notificationController));

module.exports = router;
