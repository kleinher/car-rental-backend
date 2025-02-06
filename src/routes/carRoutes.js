const express = require('express');
const carRouter = express.Router();
const {
    carEndMaintenance,
    createCarHandler,
    updateCarHandler,
    deleteCarHandler,
    getCarHandler
} = require('../controllers/CarsController');

// Maintenance endpoint
carRouter.post('/maintainance/end', carEndMaintenance);

// CRUD endpoints
carRouter.post('/', createCarHandler);
carRouter.put('/:id', updateCarHandler);
carRouter.delete('/:id', deleteCarHandler);
carRouter.get('/:id', getCarHandler);

module.exports = carRouter;