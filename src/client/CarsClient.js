const initialCars = require('../resources/data.js');
const drivers = require('../resources/drivers.js');
let data = initialCars;


function getAllCars() {
    return data.map(car => {
        const driver = drivers.find(driver => driver.id === car.driverId);
        return {
            ...car,
            driver: driver.name,
            phoneNumber: driver.phoneNumber,

        };
    });
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



module.exports = {
    getAllCars,
    updateCar,
    addCar,
    getCarByPlateAndPhone,
    getCarByPlate,
};
