const CarRepository = require('../repositories/CarRepository.js');
const Driver = require('../models/Driver.js');
const Address = require('../models/Address.js');

async function getAllCars() {
    let cars = await CarRepository.getAll(
        {
            include: [
                {
                    model: Address,
                    as: 'address',
                    attributes: ['formattedAddress']
                },
                {
                    model: Driver,
                    as: 'driver',
                    attributes: ['name']
                },

            ]
        }
    );

    return cars
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
