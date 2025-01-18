const logger = require('../config/logger');
const { updateCar, getCarByPlateAndPhone } = require('../client/CarsClient');
const { broadcast } = require('../websocket/WebSocketServer.js');

const phoneCache = new Map();


async function setDataWithCache(phoneNumber, licencePlate) {
    if (!phoneCache.has(phoneNumber)) {
        phoneCache.set(phoneNumber, new Set());
    }
    phoneCache.get(phoneNumber).add(licencePlate);

    let car = getCarByPlateAndPhone(licencePlate, phoneNumber);
    car.reminderSent = true;
    car.reminderSentDate = new Date();
    updateCar(car);
    broadcast();
}


async function updateDataWithCache(phoneNumber, message) {
    if (!phoneCache.has(phoneNumber)) {
        logger.info("Cache miss:" + phoneNumber);
        return;
    }

    if (isNaN(message)) {
        logger.error("Message is not a number: " + message);
        return;
    }

    let licencePlates = phoneCache.get(phoneNumber);
    let licencePlate = licencePlates.values().next().value; // Get the first licence plate
    let car = getCarByPlateAndPhone(licencePlate, phoneNumber);

    if (car.kilometers > message) {
        logger.error(`Kilometers for ${licencePlate} are not greater than the previous one`);
        return;
    }

    car.inMaintenance = (message - car.kilometers) > 10000 ? true : false;
    car.kilometers = message;
    car.reminderSent = false;
    car.reminderSentDate = null;
    car.lastUpdated = new Date();
    updateCar(car);
    broadcast();
    logger.info(`Updated car with licence plate ${licencePlate} for phone number ${phoneNumber}`);

    licencePlates.delete(licencePlate); // Remove the licence plate from the set
    if (licencePlates.size === 0) {
        phoneCache.delete(phoneNumber); // Remove the phone number from the cache if no licence plates are left
    }
}

module.exports = {
    setDataWithCache,
    updateDataWithCache
}
