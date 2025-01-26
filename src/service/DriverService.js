const DriverClient = require('../client/DriverClient');

const getAllDrivers = async () => {
    return await DriverClient.getAllDrivers();
};

const getDriverById = async (driverId) => {
    return await DriverClient.findById(driverId);
};

const createDriver = async (driverData) => {
    return await DriverClient.addDriver(driverData);
};

const updateDriver = async (driver) => {
    return await DriverClient.updateDriver(driver);
};

const deleteDriver = async (driverId) => {
    return await DriverClient.deleteDriver(driverId);
};

module.exports = {
    getAllDrivers,
    getDriverById,
    createDriver,
    updateDriver,
    deleteDriver
};
