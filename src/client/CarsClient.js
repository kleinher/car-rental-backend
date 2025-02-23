const CarRepository = require('../repositories/CarRepository.js');



function updateCar(car) {
    const carIndex = data.findIndex(c => c.licensePlate === car.licensePlate);
    data[carIndex] = car;
}

function addCar(newCar) {
    data.push(newCar);
    return newCar;
}

function getCarByPlateAndPhone(licensePlate, phoneNumber) {
    const car = data.find(car => car.licensePlate === licensePlate && car.phoneNumber === phoneNumber);
    if (!car) {
        throw new Error('Car not found');
    }
    return car;
}




module.exports = {
    updateCar,
    addCar,
    getCarByPlateAndPhone,
};
