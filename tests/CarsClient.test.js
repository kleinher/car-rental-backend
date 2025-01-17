const carsClient = require('../src/client/CarsClient');
const initialCars = require('../src/resources/data.js');

describe('CarsClient', () => {

    test('should get all cars', () => {
        const cars = carsClient.getAllCars();
        expect(cars).toEqual(initialCars);
    });

    test('should update a car', () => {
        const car = { licensePlate: 'ABC123', phoneNumber: '1234567890', id: 1 };
        carsClient.updateCar(car);
        const updatedCar = carsClient.getCarByPlateAndPhone('ABC123', '1234567890');
        expect(updatedCar).toEqual(car);
    });

    test('should add a new car', () => {
        const newCar = { licensePlate: 'XYZ789', phoneNumber: '0987654321', id: 2 };
        carsClient.addCar(newCar);
        const addedCar = carsClient.getCarByPlateAndPhone('XYZ789', '0987654321');
        expect(addedCar).toEqual(newCar);
    });

    test('should get a car by license plate and phone number', () => {
        const car = initialCars[0];
        const foundCar = carsClient.getCarByPlateAndPhone(car.licensePlate, car.phoneNumber);
        expect(foundCar).toEqual(car);
    });

    test('should delete a car by id', () => {
        const car = initialCars[0];
        carsClient.deleteCar(car.id);
        expect(() => carsClient.getCarByPlateAndPhone(car.licensePlate, car.phoneNumber)).toThrow('Car not found');
    });

    test('should throw an error if car not found by license plate and phone number', () => {
        expect(() => carsClient.getCarByPlateAndPhone('NONEXISTENT', '0000000000')).toThrow('Car not found');
    });

    test('should throw an error if car not found by id', () => {
        expect(() => carsClient.deleteCar(999)).toThrow('Car not found');
    });
});
