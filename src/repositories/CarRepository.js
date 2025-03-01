const Car = require('../models/Car');
const Address = require('../models/Address');
const Driver = require('../models/Driver');
const Mechanic = require('../models/Mechanic');
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

    async update(licencePlate, carData) {
        try {
            await Car.update(carData, { where: { licencePlate } });
            return licencePlate;
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

    async findByPlate(licencePlate) {
        try {
            const car = await Car.findOne({ where: { licencePlate: licencePlate } });
            if (!car) throw new Error('Car not found');
            return car;
        } catch (error) {
            logger.error('Error finding car by plate:', error);
            throw error;
        }
    }

    async getAll() {
        try {
            return await Car.findAll(
                {
                    include: [
                        {
                            model: Address,
                            as: 'address',
                            attributes: ['formatted_address'] // Solo traer el nombre de la dirección
                        },

                        {
                            model: Driver,
                            as: 'driver',
                            attributes: ['id', 'name', 'phoneNumber'] // Solo traer el nombre de la dirección
                        },
                        {
                            model: Mechanic,
                            as: 'mechanic',
                            attributes: ['name'] // Solo traer el nombre de la dirección
                        }
                    ],
                    attributes: ['id', 'licencePlate', 'kilometers', 'inMaintenance', 'estMaintainance', 'driverId', 'reminderSent', 'reminderSentDate'] // Datos de Driver que quieres mostrar
                }
            );
        } catch (error) {
            logger.error('Error getting all cars:', error);
            throw error;
        }
    }
}

module.exports = new CarRepository();
