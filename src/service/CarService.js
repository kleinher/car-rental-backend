const { broadcast } = require('../websocket/WebSocketServer.js');
const carRepository = require('../repositories/CarRepository');
const logger = require('../config/logger');
const Car = require('../models/Car');

async function endMaintenance(licencePlate) {
    try {

        const carData = {
            inMaintenance: false,
            lastMaintainance: new Date()
        };
        await Car.update(carData, { where: { licencePlate } });
        broadcast();

    } catch (error) {
        logger.error('Error ending maintenance:', error);
        throw error;
    }
}

module.exports = {
    endMaintenance
};