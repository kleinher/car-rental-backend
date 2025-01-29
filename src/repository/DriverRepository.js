const sequelize = require('../config/sequialize');
const Driver = require('../models/Driver');

const createDriver = async (driver) => {
    await sequelize.sync();

    return await Driver.create(driver);
}
const getAllDrivers = async () => {
    await sequelize.sync();

    return await Driver.findAll();
}

module.exports = { createDriver, getAllDrivers };