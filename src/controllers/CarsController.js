const { endMaintenance } = require('../service/CarService');

async function carEndMaintenance(req, res) {
    const { licencePlate } = req.body;

    if (!licencePlate) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        endMaintenance(licencePlate);
    } catch (error) {
        return res.status(404).json({ error: error.message });
    }

    res.status(200).json({
        message: 'Car maintenance ended successfully',
        licencePlate: { licencePlate }
    });
}

module.exports = { carEndMaintenance };