const express = require('express');
const driverRouter = express.Router();
const { createDriver, deleteDriver, getDriverById, getDrivers, updateDriver } = require('../controllers/DriversController');


driverRouter.get('/', (req, res) => getDrivers(req, res));
driverRouter.get('/:id', (req, res) => getDriverById(req, res));
driverRouter.post('/', (req, res) => createDriver(req, res));
driverRouter.put('/:id', (req, res) => updateDriver(req, res));
driverRouter.delete('/:id', (req, res) => deleteDriver(req, res));

module.exports = driverRouter;