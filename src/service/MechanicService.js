const MechanicRepository = require('../repository/MechanicRepository');

const getAllMechanics = async () => {
    return await MechanicRepository.getAllMechanics();
};

const getMechanicById = async (mechanicId) => {
    return await MechanicClient.findById(mechanicId);
};

const createMechanic = async (mechanicData) => {
    return await MechanicRepository.createMechanic(mechanicData);
};

const updateMechanic = async (mechanic) => {
    return await MechanicClient.updateMechanic(mechanic);
};

const deleteMechanic = async (mechanicId) => {
    return await MechanicClient.deleteMechanic(mechanicId);
};

module.exports = {
    getAllMechanics,
    getMechanicById,
    createMechanic,
    updateMechanic,
    deleteMechanic
};
