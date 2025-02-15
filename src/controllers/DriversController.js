const Driver = require('../models/Driver.js');
const DriverRepository = require('../repository/DriverRepository.js');
const logger = require('../config/logger.js');
const Address = require('../models/Address.js');
const Util = require('../util/controllers/UtilFunctions.js');
module.exports = {
    async getDrivers(req, res) {
        logger.info('Getting all drivers');

        try {
            const drivers = await Driver.findAll({
                include: [
                    {
                        model: Address,
                        as: 'address',
                        attributes: ['formatted_address'] // Solo traer el nombre de la dirección
                    }
                ],
                attributes: ['id', 'name', 'phoneNumber'] // Datos de Driver que quieres mostrar
            });
            logger.info(`Successfully retrieved ${drivers.length} drivers`);
            res.status(200).json(drivers);
        } catch (error) {
            logger.error(`Error fetching drivers: ${error.message}`);
            res.status(500).json({ error: 'An error occurred while fetching drivers' });
        }
    },

    async createDriver(req, res) {
        logger.info('Creating new driver');
        try {
            const driverAddress = await Util.createAddress(req);

            const driver = {
                name: req.body.name,
                phoneNumber: req.body.phoneNumber,
                addressId: driverAddress.id
            };
            const nuevoDriver = await Driver.create(driver);
            logger.info(`Successfully created driver with id: ${nuevoDriver.id}`);
            res.status(201).json(nuevoDriver.id);
        } catch (error) {
            logger.error(`Error creating driver: ${error.message}`);
            res.status(500).json({ error: 'An error occurred while creating the driver' });
        }
    },

    async updateDriver(req, res) {
        logger.info(`Updating driver with id: ${req.params.id}`);
        try {
            const driver = await DriverRepository.updateDriver(req.params.id, req.body, { new: true });
            if (!driver) {
                logger.warn(`Driver not found for update with id: ${req.params.id}`);
                return res.status(404).json({ error: 'Driver not found' });
            }

            logger.info(`Successfully updated driver ${req.params.id}`);
            res.status(200).json(driver);
        } catch (error) {
            logger.error(`Error updating driver ${req.params.id}: ${error.message}`);
            res.status(500).json({ error: 'An error occurred while updating the driver' });
        }
    },

    async deleteDriver(req, res) {
        logger.info(`Deleting driver with id: ${req.params.id}`);
        try {
            const driver = await DriverRepository.deleteDriver(req.params.id);
            if (!driver) {
                logger.warn(`Driver not found for deletion with id: ${req.params.id}`);
                return res.status(404).json({ error: 'Driver not found' });
            }
            logger.info(`Successfully deleted driver ${req.params.id}`);
            res.status(200).json({ message: 'Driver deleted successfully' });
        } catch (error) {
            logger.error(`Error deleting driver ${req.params.id}: ${error.message}`);
            res.status(500).json({ error: 'An error occurred while deleting the driver' });
        }
    }
};

