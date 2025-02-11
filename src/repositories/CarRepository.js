const Car = require('../models/Car');
const Address = require('../models/Address');
const logger = require('../config/logger');

class CarRepository {
    async create(carData) {
        try {
            const address = await Address.create(carData.address);
            const car = await Car.create({
                ...carData,
                addressId: address.id,
                lastUpdate: new Date(),
                inMaintenance: carData.inMaintenance || false
            });

            return car;
        } catch (error) {
            logger.error('Error creating car:', error);
            throw error;
        }
    }

    async update(id, carData) {
        try {
            const car = await Car.findByPk(id);
            if (!car) throw new Error('Car not found');
            return await car.update(carData);
        } catch (error) {
            logger.error('Error updating car:', error);
            throw error;
        }
    }

    async delete(id) {
        try {
            const car = await Car.findByPk(id);
            if (!car) throw new Error('Car not found');
            await car.destroy();
        } catch (error) {
            logger.error('Error deleting car:', error);
            throw error;
        }
    }

    async findById(id) {
        try {
            const car = await Car.findByPk(id);
            if (!car) throw new Error('Car not found');
            return car;
        } catch (error) {
            logger.error('Error finding car:', error);
            throw error;
        }
    }

    async findByPlate(licensePlate) {
        try {
            const car = await Car.findOne({ where: { licencePlate: licensePlate } });
            if (!car) throw new Error('Car not found');
            return car;
        } catch (error) {
            logger.error('Error finding car by plate:', error);
            throw error;
        }
    }

    async getAll() {
        try {
            return await Car.findAll();
        } catch (error) {
            logger.error('Error getting all cars:', error);
            throw error;
        }
    }
}

module.exports = new CarRepository();
