const express = require('express');
const carRouter = express.Router();
const CarsController = require('../controllers/CarsController');

// Maintenance endpoint
carRouter.post('/maintainance/end', CarsController.carEndMaintenance);

// Add this new route
carRouter.get('/', CarsController.getAllCarsHandler);

// CRUD endpoints
carRouter.post('/', CarsController.createCarHandler);
carRouter.put('/:id', CarsController.updateCarHandler);
carRouter.delete('/:id', CarsController.deleteCarHandler);
carRouter.get('/:id', CarsController.getCarHandler);

module.exports = carRouter;