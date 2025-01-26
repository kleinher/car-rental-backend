const { broadcast } = require('../websocket/WebSocketServer.js');
const { getAllCars } = require('../client/CarsClient.js');
const { getCarByPlate, updateCar } = require('../client/CarsClient');
async function endMaintenance(licensePlate) {
    const car = getCarByPlate(licensePlate);
    if (car === -1) {
        throw new Error('Car not found.');
    }
    car.inMaintenance = false;
    car.lastMaintainance = new Date();
    updateCar(car);

    broadcast(getAllCars());
}

module.exports = { endMaintenance };