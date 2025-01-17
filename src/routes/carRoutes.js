const express = require('express');
const carRouter = express.Router();
const { carEndMaintenance } = require('../controllers/CarsController');

carRouter.post('/maintainance/end', (req, res) => carEndMaintenance(req, res));
module.exports = carRouter;