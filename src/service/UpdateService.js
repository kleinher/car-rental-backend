const logger = require('../config/logger');
const { updateCar, getCarByPlateAndPhone } = require('../client/CarsClient');
const { broadcast } = require('../websocket/WebSocketServer.js');

const cache = new Map();

async function setDataWithCache(phoneNumber, licencePlate) {
    if (cache.has(phoneNumber)) {
        logger.info("Cache hit:" + phoneNumber);
        return;
    }
    cache.set(phoneNumber, licencePlate);
    let car = getCarByPlateAndPhone(cache.get(phoneNumber), phoneNumber);
    car.reminderSent = true;
    car.reminderSentDate = new Date();
    updateCar(car);
    broadcast();
}

async function updateDataWithCache(phoneNumber, message) {
    if (cache.has(phoneNumber)) {
        if (!isNaN(message)) {
            let car = getCarByPlateAndPhone(cache.get(phoneNumber), phoneNumber);

            if (car.kilometers > message) {
                logger.error("Kilometers are not greater than the previous one");
                return;
            }

            car.inMaintenance = (message - car.kilometers) > 10000 ? true : false;
            car.kilometers = message;
            car.reminderSent = false;
            car.reminderSentDate = null;
            cache.delete(phoneNumber);
            updateCar(car);
            broadcast();
            logger.info("Es numero:" + message);

        } else {
            logger.error("Message is not a number: " + message);
        }
        return;
    }
    logger.info("Cache miss:" + phoneNumber);
}

module.exports = {
    setDataWithCache,
    updateDataWithCache
}
