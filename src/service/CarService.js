const { broadcast } = require('../websocket/WebSocketServer.js');
const carRepository = require('../repositories/CarRepository');
const logger = require('../config/logger');

async function createCar(carData) {
    return await carRepository.create(carData);
}

async function updateCar(id, carData) {
    return await carRepository.update(id, carData);
}

async function deleteCar(id) {
    return await carRepository.delete(id);
}

async function getCar(id) {
    return await carRepository.findById(id);
}

async function getAllCars() {
    return await carRepository.getAll();
}

async function endMaintenance(licensePlate) {
    try {
        const car = await carRepository.findByPlate(licensePlate);
        await carRepository.update(car.id, {
            inMaintenance: false,
            lastMaintainance: new Date()
        });

        const cars = await getAllCars();
        broadcast(cars);
    } catch (error) {
        logger.error('Error ending maintenance:', error);
        throw error;
    }
}

module.exports = {
    createCar,
    updateCar,
    deleteCar,
    getCar,
    getAllCars,
    endMaintenance
};