const { broadcast } = require('../websocket/WebSocketServer.js');
const carRepository = require('../repositories/CarRepository');
const logger = require('../config/logger');

async function endMaintenance(licensePlate) {
    try {
        const car = await carRepository.findByPlate(licensePlate);
        await carRepository.update(car.id, {
            inMaintenance: false,
            lastMaintainance: new Date()
        });

        const cars = await getAllCars();
        broadcast();
    } catch (error) {
        logger.error('Error ending maintenance:', error);
        throw error;
    }
}

module.exports = {
    endMaintenance
};