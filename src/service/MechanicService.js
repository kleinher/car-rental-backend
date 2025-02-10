const MechanicRepository = require('../repository/MechanicRepository');

const getAllMechanics = async () => {
    return await MechanicRepository.getAllMechanics();
};

const getMechanicById = async (mechanicId) => {
    return await MechanicRepository.findById(mechanicId);
};

const createMechanic = async (mechanicData) => {
    return await MechanicRepository.createMechanic(mechanicData);
};

const updateMechanic = async (id, mechanic) => {
    return await MechanicRepository.updateMechanic(id, mechanic);
};

const deleteMechanic = async (mechanicId) => {
    return await MechanicRepository.deleteMechanic(mechanicId);
};

module.exports = {
    getAllMechanics,
    getMechanicById,
    createMechanic,
    updateMechanic,
    deleteMechanic
};
