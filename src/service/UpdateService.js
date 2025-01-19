const logger = require('../config/logger');
const { updateCar, getCarByPlateAndPhone } = require('../client/CarsClient');
const { broadcast } = require('../websocket/WebSocketServer.js');
const { handleUserMessage } = require('./gpt/ChatService');


let phoneCache = new Map();

async function processFirstMessage(phoneNumber, licencePlate) {
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


async function processUserMessage(phoneNumber, message) {
    if (!phoneCache.has(phoneNumber)) {
        logger.info("Cache miss:" + phoneNumber);
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