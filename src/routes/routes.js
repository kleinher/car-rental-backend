const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/NotificationController');


router.post('/send', (req, res) => NotificationController.sendNotification(req, res));

module.exports = router;
