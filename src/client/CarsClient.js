const initialCars = require('../resources/data.js');

class CarsClient {
    constructor() {
        this.data = initialCars;
    }

    updateCar(car) {
        const carIndex = this.data.findIndex(c => c.licensePlate === car.licensePlate);

        this.data[carIndex] = car;
        return;
    }

    addCar(newCar) {
        this.data.push(newCar);
        return newCar;
    }

    getCarByPlateAndPhone(licensePlate, phoneNumber) {
        const car = this.data.find(car => car.licensePlate === licensePlate && car.phoneNumber === phoneNumber);
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

module.exports = new CarsClient();