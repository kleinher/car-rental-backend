const DriverRepository = require('../repository/DriverRepository');

const getAllDrivers = async () => {
    return await DriverRepository.getAllDrivers();
};

const getDriverById = async (driverId) => {
    return await DriverRepository.findById(driverId);
};

const createDriver = async (driverData) => {
    return await DriverRepository.createDriver(driverData);
};

const updateDriver = async (driver) => {
    return await DriverRepository.updateDriver(driver);
};

const deleteDriver = async (driverId) => {
    return await DriverRepository.deleteDriver(driverId);
};

module.exports = {
    getAllDrivers,
    getDriverById,
    createDriver,
    updateDriver,
    deleteDriver
};
