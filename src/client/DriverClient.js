const initialDrivers = require('../resources/drivers.js').default;
let data = initialDrivers;

function getAllDrivers() {
    return data;
}

function updateDriver(driver) {
    const driverIndex = data.findIndex(d => d.licenseNumber === driver.licenseNumber);
    if (driverIndex === -1) {
        throw new Error('Driver not found');
    }
    data[driverIndex] = driver;
}

function addDriver(newDriver) {
    data.push(newDriver);
    return newDriver;
}

function getDriverByLicenseAndPhone(licenseNumber, phoneNumber) {
    const driver = data.find(driver => driver.licenseNumber === licenseNumber && driver.phoneNumber === phoneNumber);
    if (!driver) {
        throw new Error('Driver not found');
    }
    return driver;
}

function getDriverByLicense(licenseNumber) {
    const driver = data.find(driver => driver.licenseNumber === licenseNumber);
    if (!driver) {
        throw new Error('Driver not found');
    }
    return driver;
}

module.exports = {
    getAllDrivers,
    updateDriver,
    addDriver,
    getDriverByLicenseAndPhone,
    getDriverByLicense,
};
