// models/Driver.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequialize');
const logger = require('../config/logger');

const Driver = sequelize.define('Driver', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    latitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    longitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
}, {
    timestamps: true,
});
Driver.prototype.agregar = async function () {
    try {
        const nuevoDriver = await this.save();
        logger.info('Driver agregado a la base de datos:', nuevoDriver.id);
        return nuevoDriver.id;
    } catch (error) {
        logger.error('Error al agregar el driver:', error);
        throw error;
    }
};

module.exports = Driver;
