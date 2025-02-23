const logger = require('../config/logger');
const { updateCar, getCarByPlate, getAllCars } = require('../client/CarsClient');
const { broadcast } = require('../websocket/WebSocketServer.js');
const { handleUserMessage } = require('./gpt/ChatService');
const ChatService = require('./gpt/ChatService');
const CarRepository = require('../repositories/CarRepository.js');


let phoneCache = new Map();

async function processFirstMessage(phoneNumber, licencePlate) {
    logger.info(`Procesando primer mensaje al cliente ${phoneNumber}`)
    if (!phoneCache.has(phoneNumber)) {
        phoneCache.set(phoneNumber, new Set());
    }

    phoneCache.get(phoneNumber).add(licencePlate);

    let car = await CarRepository.findByPlate(licencePlate);
    car.reminderSent = true;
    car.reminderSentDate = new Date();
    CarRepository.update(car.id, car);
    broadcast(CarRepository.getAll());
}


async function processUserMessage(phoneNumber, hasMedia, message) {
    if (!phoneCache.has(phoneNumber)) {
        logger.info("Cache miss:" + phoneNumber);
        return;
    }
    if (hasMedia) {
        ChatService.hadleMediaMessage(phoneNumber);
        return;
    }
    const licencePlate = phoneCache.get(phoneNumber).values().next().value;
    const result = await handleUserMessage(phoneNumber, licencePlate, message);

    if (result.done) {
        const licencePlates = phoneCache.get(phoneNumber); // Agrega esto
        licencePlates.delete(licencePlate); // Corrige este acceso
        if (licencePlates.size === 0) {
            phoneCache.delete(phoneNumber); // Remueve el número si ya no hay matrículas
        }
    }

}
module.exports = {
    processUserMessage,
    processFirstMessage
};