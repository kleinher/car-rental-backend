const initialCars = require('../resources/data.js');
let data = initialCars;


function getAllCars() {
    return data;
}

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

function getCarByPlate(licensePlate) {
    const car = data.find(car => car.licensePlate === licensePlate);
    if (!car) {
        throw new Error('Car not found');
    }
    return car;
}

function deleteCar(id) {
    const carIndex = data.findIndex(car => car.id === id);
    if (carIndex !== -1) {
        data.splice(carIndex, 1);
    } else {
        throw new Error('Car not found');
    }
}

module.exports = {
    getAllCars,
    updateCar,
    addCar,
    getCarByPlateAndPhone,
    getCarByPlate,
    deleteCar,
};
