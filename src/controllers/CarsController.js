const CarService = require('../service/CarService');
const logger = require('../config/logger');
const CarRepository = require('../repositories/CarRepository')
async function carEndMaintenance(req, res) {
    const { licencePlate } = req.body;

    if (!licencePlate) {
        return res.status(400).json({ error: 'Missing license plate' });
    }

    try {
        await CarService.endMaintenance(licencePlate);
        res.status(200).json({
            message: 'Car maintenance ended successfully',
            licencePlate
        });
    } catch (error) {
        logger.error('Error in carEndMaintenance:', error);
        res.status(404).json({ error: error.message });
    }
}


async function createCarHandler(req, res) {
    const { licencePlate, kilometers, latitude, longitude, address,
        estMaintainance, driverId, inMaintenance } = req.body;

    if (!licencePlate || !latitude || !longitude || !address) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const carData = {
            licencePlate,
            kilometers,
            latitude,
            longitude,
            address,
            estMaintainance: estMaintainance || null,
            driverId: driverId || null,
            inMaintenance: inMaintenance || false,
            lastUpdate: new Date()
        };
        const car = await CarService.createCar(carData);
        res.status(201).json(car);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function updateCarHandler(req, res) {
    const { id } = req.params;
    const { licencePlate, kilometers, latitude, longitude, address,
        estMaintainance, driverId, inMaintenance } = req.body;

    if (!licencePlate || !latitude || !longitude || !address) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const carData = {
            licencePlate,
            kilometers,
            latitude,
            longitude,
            address,
            estMaintainance,
            driverId,
            inMaintenance,
            lastUpdate: new Date()
        };
        const car = await CarService.updateCar(id, carData);
        res.status(200).json(car);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deleteCarHandler(req, res) {
    const { id } = req.params;

    try {
        await CarService.deleteCar(id);
        res.status(200).json({ message: 'Car deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getCarHandler(req, res) {
    const { id } = req.params;

    try {
        const car = await CarService.getCar(id);
        res.status(200).json(car);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

async function getAllCarsHandler(req, res) {
    try {
        const cars = await CarRepository.getAll(

        );
        res.status(200).json(cars);
    } catch (error) {
        logger.error('Error getting all cars:', error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    carEndMaintenance,
    createCarHandler,
    updateCarHandler,
    deleteCarHandler,
    getCarHandler,
    getAllCarsHandler  // Add this to exports
};