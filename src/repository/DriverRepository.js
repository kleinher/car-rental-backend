const sequelize = require('../config/sequialize');
const Driver = require('../models/Driver');

const createDriver = async (driver) => {
    await sequelize.sync();
    return await Driver.create(driver);
}

const getAllDrivers = async () => {
    await sequelize.sync();
    return await Driver.findAll({
        include: [
            {
                model: Address,
                as: 'address',
                attributes: ['formattedAddress']
            }]
    }
    );
}

const getDriverById = async (id) => {
    await sequelize.sync();
    return await Driver.findByPk(id);
}

const updateDriver = async (id, updatedDriver) => {
    await sequelize.sync();
    const driver = await Driver.findByPk(id);
    if (driver) {
        return await driver.update(updatedDriver);
    }
    return null;
}

const deleteDriver = async (id) => {
    await sequelize.sync();
    const driver = await Driver.findByPk(id);
    if (driver) {
        await driver.destroy();
        return true;
    }
    return false;
}

module.exports = { createDriver, getAllDrivers, getDriverById, updateDriver, deleteDriver };