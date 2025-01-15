const logger = require('../config/logger');
const CarsClient = require('../client/CarsClient');

class UpdateService {
    constructor() {
        this.cache = new Map();
        this.carsClient = CarsClient;
    }

    async setDataWithCache(phoneNumber, licencePlate) {
        if (this.cache.has(phoneNumber)) {
            logger.info("Cache hit:" + phoneNumber);
            return;
        }

        logger.info("Cache miss:" + phoneNumber);
        this.cache.set(phoneNumber, licencePlate);
    }

    async updateDataWithCache(phoneNumber, message) {
        if (this.cache.has(phoneNumber)) {
            logger.info("Cache hit:" + phoneNumber);
            if (!isNaN(message)) {
                let car = this.carsClient.getCarByPlateAndPhone(this.cache.get(phoneNumber), phoneNumber);

                if (car.kilometers > message) {
                    logger.error("Kilometers are not greater than the previous one");
                    return;
                }

                car.inMaintenance = (message - car.kilometers) > 10000 ? true : false;
                car.kilometers = message;
                car.reminderSent = false;
                car.reminderSentDate = null;
                this.cache.delete(phoneNumber);

                CarsClient.updateCar(car);
                logger.info("Es numero:" + message);

            } else {
                logger.error("Message is not a number: " + message);
            }
            return;
        }
        logger.info("Cache miss:" + phoneNumber);
    }
}

module.exports = new UpdateService();
