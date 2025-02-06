const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequialize');
const logger = require('../config/logger');

const Car = sequelize.define('Car', {
    licencePlate: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    kilometers: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    latitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    longitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    estMaintainance: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    lastUpdate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    driverId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Drivers',
            key: 'id',
        },
        allowNull: true,
    },
    inMaintenance: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    lastMaintainance: {
        type: DataTypes.DATE,
        allowNull: true
    },
}, {
    timestamps: true,
});

module.exports = Car;