const express = require('express');
const router = express.Router();
const { sendNotification } = require('../controllers/NotificationController');
const { carEndMaintenance } = require('../controllers/CarsController');

router.post('/send', (req, res) => sendNotification(req, res));
router.post('/car/maintainance/end', (req, res) => carEndMaintenance(req, res));

module.exports = router;
