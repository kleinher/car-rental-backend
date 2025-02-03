const { agregarDB } = require('../service/GenericService.js');
const Mechanic = require('../models/Mechanic.js');
module.exports = {
    async getMechanics(req, res) {
        try {
            const mechanics = await MechanicService.getAllMechanics();
            res.status(200).json(mechanics);
        } catch (error) {
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
            const mechanic = {
                name: req.body.name,
                phoneNumber: req.body.phoneNumber,
                address: req.body.address,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
            };

            const nuevoMechanic = Mechanic.build(mechanic);
            const id = await agregarDB(nuevoMechanic);
            res.status(201).json(id);
        } catch (error) {
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
