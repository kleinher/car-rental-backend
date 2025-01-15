const logger = require('../config/logger');
const CarsClient = require('../client/CarsClient');

const cache = new Map();
const carsClient = new CarsClient();
async function setDataWithCache(phoneNumber, licencePlate) {
    if (cache.has(phoneNumber)) {
        logger.info("Cache hit:" + phoneNumber);
        return;
    }

    logger.info("Cache miss:" + phoneNumber);
    cache.set(phoneNumber, licencePlate);

    return;
};

async function updateDataWithCache(phoneNumber, message) {
    if (cache.has(phoneNumber)) {
        logger.info("Cache hit:" + phoneNumber);
        if (!isNaN(message)) {
            let car = carsClient.getCarByPlateAndPhone(cache.get(phoneNumber), phoneNumber);
            if (car === null) {
                logger.error("Car not found");
                return;
            }
            if (car.kilometers > message) {
                logger.error("Kilometers are not greater than the previous one");
                return;
            }
            car.kilometers = message;
            CarsClient.updateCar(car);
            //validar que sea mayor que el anterior
            //guardar en db
            logger.info("Es numero:" + message);
        } else {
            logger.error("Message is not a number: " + message);
        }
        return;
    }

    logger.info("Cache miss:" + phoneNumber);
    return;
};

module.exports = {
    setDataWithCache,
    updateDataWithCache

};
