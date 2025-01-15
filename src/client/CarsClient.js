const initialCars = require('../resources/data.js');

class CarsClient {
    constructor() {
        this.data = initialCars;
    }

    updateCar(id, newValues) {

    }

    addCar(newCar) {
        this.data.push(newCar);
        return newCar;
    }

    getCarByPlateAndPhone(licencePlate, phoneNumber) {
        const car = this.data.find(car => car.licencePlate === licencePlate && car.phoneNumber === phoneNumber);
        if (!car) {
            throw new Error('Car not found');
        }
        return car;
    }

    deleteCar(id) {
        const carIndex = this.data.findIndex(car => car.id === id);
        if (carIndex !== -1) {
            return this.data.cars.splice(carIndex, 1);
        } else {
            throw new Error('Car not found');
        }
    }
}

module.exports = CarsClient;