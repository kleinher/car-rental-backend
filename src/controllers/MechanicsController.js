const MechanicService = require('../service/MechanicService.js');
const Mechanic = require('../models/Mechanic.js');
const Address = require('../models/Address.js')
const logger = require('../config/logger.js')
const Util = require('../util/controllers/UtilFunctions.js');



module.exports = {
    async getMechanics(req, res) {
        logger.info('Getting all mechanics');
        try {
            const mechanics = await Mechanic.findAll({
                include: [
                    {
                        model: Address,
                        as: 'address',
                        attributes: ['formatted_address'] // Solo traer el nombre de la dirección
                    }
                ],
                attributes: ['id', 'name', 'phoneNumber'] // Datos de Driver que quieres mostrar
            });
            res.status(200).json(mechanics);
        } catch (error) {
            logger.error(`Error fetching mechanics: ${error.message}`);
            res.status(500).json({ error: 'An error occurred while fetching mechanics' });
        }
    },

    async getMechanicById(req, res) {
        logger.info(`Getting mechanic with id: ${req.params.id}`);
        try {
            const mechanic = await MechanicService.getMechanicById(req.params.id);
            if (!mechanic) {
                return res.status(404).json({ error: 'Mechanic not found' });
            }
            res.status(200).json(mechanic);
        } catch (error) {
            logger.error(`Error fetching mechanic ${req.params.id}: ${error.message}`);
            res.status(500).json({ error: 'An error occurred while fetching the mechanic' });
        }
    },

    async createMechanic(req, res) {
        logger.info('Creating new mechanic:', req.body.name);
        try {
            const driverAddress = await Util.createAddress(req)

            const mechanic = {
                name: req.body.name,
                phoneNumber: req.body.phoneNumber,
                addressId: driverAddress.id
            };

            const nuevoMechanic = await Mechanic.create(mechanic);
            logger.info(`Mechanic created successfully with id: ${nuevoMechanic.id}`);
            res.status(201).json(nuevoMechanic.id);
        } catch (error) {
            logger.error('Error al crear un mecanico' + error);
            res.status(500).json({ error: 'An error occurred while creating the mechanic' });
        }
    },

    async updateMechanic(req, res) {
        logger.info(`Updating mechanic with id: ${req.params.id}`);
        try {
            const mechanic = await MechanicService.updateMechanic(req.params.id, req.body);
            if (!mechanic) {
                logger.warn(`Mechanic not found with id: ${req.params.id}`);
                return res.status(404).json({ error: 'Mechanic not found' });
            }
            logger.info(`Mechanic ${req.params.id} updated successfully`);
            res.status(200).json(mechanic);
        } catch (error) {
            logger.error(`Error updating mechanic ${req.params.id}: ${error.message}`);
            res.status(500).json({ error: 'An error occurred while updating the mechanic' });
        }
    },

    async deleteMechanic(req, res) {
        logger.info(`Deleting mechanic with id: ${req.params.id}`);
        try {
            const mechanic = await MechanicService.deleteMechanic(req.params.id);
            if (!mechanic) {
                logger.warn(`Mechanic not found with id: ${req.params.id}`);
                return res.status(404).json({ error: 'Mechanic not found' });
            }
            logger.info(`Mechanic ${req.params.id} deleted successfully`);
            res.status(200).json({ message: 'Mechanic deleted successfully' });
        } catch (error) {
            logger.error(`Error deleting mechanic ${req.params.id}: ${error.message}`);
            res.status(500).json({ error: 'An error occurred while deleting the mechanic' });
        }
    }
};
