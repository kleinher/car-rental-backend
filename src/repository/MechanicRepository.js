const sequelize = require('../config/sequelize');
const Mechanic = require('../models/Mechanic');

const createMechanic = async (mechanic) => {
    await sequelize.sync();
    return await Mechanic.create(mechanic);
}

const getAllMechanics = async () => {
    await sequelize.sync();
    return await Mechanic.findAll();
}

const getMechanicById = async (id) => {
    await sequelize.sync();
    return await Mechanic.findByPk(id);
}

const updateMechanic = async (id, updatedMechanic) => {
    await sequelize.sync();
    const mechanic = await Mechanic.findByPk(id);
    if (mechanic) {
        return await mechanic.update(updatedMechanic);
    }
    return null;
}

const deleteMechanic = async (id) => {
    await sequelize.sync();
    const mechanic = await Mechanic.findByPk(id);
    if (mechanic) {
        await mechanic.destroy();
        return true;
    }
    return false;
}

module.exports = { createMechanic, getAllMechanics, getMechanicById, updateMechanic, deleteMechanic };
