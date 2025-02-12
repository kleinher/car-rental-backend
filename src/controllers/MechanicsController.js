const { agregarDB } = require('../service/GenericService.js');
const MechanicService = require('../service/MechanicService.js');
const Mechanic = require('../models/Mechanic.js');
const Address = require('../models/Address.js')
const logger = require('../config/logger.js')
module.exports = {
    async getMechanics(req, res) {
        try {
            const mechanics = await Mechanic.findAll({
                include: [
                    {
                        model: Address,
                        as: 'address',
                        attributes: ['formattedAddress'] // Solo traer el nombre de la dirección
                    }
                ],
                attributes: ['id', 'name', 'phoneNumber'] // Datos de Driver que quieres mostrar
            });
            res.status(200).json(mechanics);
        } catch (error) {
            logger.error('Error al obtener los mecanicos' + error)
            res.status(500).json({ error: 'An error occurred while fetching mechanics' });
        }
    },

    async getMechanicById(req, res) {
        try {
            const mechanic = await MechanicService.getMechanicById(req.params.id);
            if (!mechanic) {
                return res.status(404).json({ error: 'Mechanic not found' });
            }
            res.status(200).json(mechanic);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching the mechanic' });
        }
    },

    async createMechanic(req, res) {
        try {
            const address = {
                formattedAddress: req.body.address,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
            }
            const driverAddress = await Address.create(address)

            const mechanic = {
                name: req.body.name,
                phoneNumber: req.body.phoneNumber,
                addressId: driverAddress.id
            };

            const nuevoMechanic = Mechanic.create(mechanic);
            res.status(201).json(nuevoMechanic.id);
        } catch (error) {
            logger.error('Error al crear un mecanico' + error);
            res.status(500).json({ error: 'An error occurred while creating the mechanic' });
        }
    },

    async updateMechanic(req, res) {
        try {
            const mechanic = await MechanicService.updateMechanic(req.params.id, req.body);
            if (!mechanic) {
                return res.status(404).json({ error: 'Mechanic not found' });
            }
            res.status(200).json(mechanic);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while updating the mechanic' });
        }
    },

    async deleteMechanic(req, res) {
        try {
            const mechanic = await MechanicService.deleteMechanic(req.params.id);
            if (!mechanic) {
                return res.status(404).json({ error: 'Mechanic not found' });
            }
            res.status(200).json({ message: 'Mechanic deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while deleting the mechanic' });
        }
    }
};
