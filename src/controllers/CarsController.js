const CarService = require('../service/CarService');
const logger = require('../config/logger');
const CarRepository = require('../repositories/CarRepository');

async function carEndMaintenance(req, res) {
    const { licencePlate } = req.body;

    if (!licencePlate) {
        logger.error('Error in carEndMaintenance: Missing license plate');
        return res.status(400).json({ error: 'Missing license plate' });
    }

    try {
        await CarService.endMaintenance(licencePlate);
        logger.info(`Car maintenance ended successfully for licence plate: ${licencePlate}`);
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
    logger.info('Creating new car');
    const { licencePlate, kilometers, address, estMaintainance, driverId, inMaintenance, mechanicId } = req.body;

    if (!licencePlate || !address) {
        logger.error('Error in createCarHandler: Missing required fields');
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const carData = {
            licencePlate,
            kilometers,
            address,
            estMaintainance: estMaintainance || null,
            driverId,
            inMaintenance: inMaintenance || false,
            lastUpdate: new Date(),
            mechanicId
        };
        const car = await CarRepository.create(carData);
        logger.info(`Car created successfully with licence plate: ${licencePlate}`);
        res.status(201).json(car);
    } catch (error) {
        logger.error('Error in createCarHandler:', error);
        res.status(500).json({ error: error.message });
    }
}

async function updateCarHandler(req, res) {
    const { id } = req.params;
    const { licencePlate, kilometers, latitude, longitude, address, estMaintainance, driverId, inMaintenance } = req.body;

    if (!licencePlate || !address) {
        logger.error('Error in updateCarHandler: Missing required fields');
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
        const car = await CarRepository.update(licencePlate, carData);
        logger.info(`Car updated successfully with id: ${id}`);
        res.status(200).json(car);
    } catch (error) {
        logger.error('Error in updateCarHandler:', error);
        res.status(500).json({ error: error.message });
    }
}

async function deleteCarHandler(req, res) {
    const { id } = req.params;

    try {
        await CarRepository.delete(id);
        logger.info(`Car deleted successfully with id: ${id}`);
        res.status(200).json({ message: 'Car deleted successfully' });
    } catch (error) {
        logger.error('Error in deleteCarHandler:', error);
        res.status(500).json({ error: error.message });
    }
}

async function getCarHandler(req, res) {
    const { id } = req.params;

    try {
        const car = await CarRepository.findById(id);
        logger.info(`Car retrieved successfully with id: ${id}`);
        res.status(200).json(car);
    } catch (error) {
        logger.error('Error in getCarHandler:', error);
        res.status(404).json({ error: error.message });
    }
}

async function getAllCarsHandler(req, res) {
    try {
        const cars = await CarRepository.getAll();
        logger.info('All cars retrieved successfully');
        res.status(200).json(cars);
    } catch (error) {
        logger.error('Error in getAllCarsHandler:', error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    carEndMaintenance,
    createCarHandler,
    updateCarHandler,
    deleteCarHandler,
    getCarHandler,
    getAllCarsHandler
};