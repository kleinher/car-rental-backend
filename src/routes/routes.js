const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/NotificationController');
const { carEndMaintenance } = require('../controllers/CarsController');

router.post('/send', (req, res) => NotificationController.sendNotification(req, res));
router.post('/car/maintainance/end', (req, res) => carEndMaintenance(req, res));

module.exports = router;
