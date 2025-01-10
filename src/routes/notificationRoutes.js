const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Rutas
router.post('/send', notificationController.sendNotification);

module.exports = router;
