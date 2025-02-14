const sequelize = require('../config/sequelize');
const Driver = require('../models/Driver');
const Address = require('../models/Address');

const createDriver = async (driver) => {
    await sequelize.sync();
    return await Driver.create(driver);
}

const getAllDrivers = async () => {
    const drivers = await Driver.findAll({
        include: [
            {
                model: Address,
                as: 'address',
                attributes: ['formatted_address'] // Solo traer el nombre de la dirección
            }
        ],
        attributes: ['id', 'name', 'phoneNumber'] // Datos de Driver que quieres mostrar
    });

    return drivers;
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