const Driver = require('../models/Driver.js');
const DriverService = require('../service/DriverService.js');

module.exports = {
    async getDrivers(req, res) {
        try {
            const drivers = await DriverService.getAllDrivers();
            res.status(200).json(drivers);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching drivers' });
        }
    },

    async getDriverById(req, res) {
        try {
            const driver = await Driver.findById(req.params.id);
            if (!driver) {
                return res.status(404).json({ error: 'Driver not found' });
            }
            res.status(200).json(driver);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching the driver' });
        }
    },

    async createDriver(req, res) {
        try {
            const driver = {
                name: req.body.name,
                licenseNumber: req.body.licenseNumber,
                vehicle: req.body.vehicle
            };
            await DriverService.createDriver(driver);
            res.status(201).json(driver);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while creating the driver' });
        }
    },

    async updateDriver(req, res) {
        try {
            const driver = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!driver) {
                return res.status(404).json({ error: 'Driver not found' });
            }
            res.status(200).json(driver);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while updating the driver' });
        }
    },

    async deleteDriver(req, res) {
        try {
            const driver = await Driver.findByIdAndDelete(req.params.id);
            if (!driver) {
                return res.status(404).json({ error: 'Driver not found' });
            }
            res.status(200).json({ message: 'Driver deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while deleting the driver' });
        }
    }
};