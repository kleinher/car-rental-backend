const { broadcast } = require('../websocket/WebSocketServer.js');

const { getCarByPlate, updateCar } = require('../client/CarsClient');
async function endMaintenance(licensePlate) {
    const car = getCarByPlate(licensePlate);
    if (car === -1) {
        throw new Error('Car not found.');
    }
    car.inMaintenance = false;
    updateCar(car);
    broadcast();
}

module.exports = { endMaintenance };