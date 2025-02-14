const express = require('express');
const driverRouter = express.Router();
const DriversController = require('../controllers/DriversController');


driverRouter.get('/', (req, res) => DriversController.getDrivers(req, res));
driverRouter.get('/:id', (req, res) => DriversController.getDriverById(req, res));
driverRouter.post('/', (req, res) => DriversController.createDriver(req, res));
driverRouter.put('/:id', (req, res) => DriversController.updateDriver(req, res));
driverRouter.delete('/:id', (req, res) => DriversController.deleteDriver(req, res));

module.exports = driverRouter;