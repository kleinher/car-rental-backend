const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequialize');
const logger = require('../config/logger');

const Mechanic = sequelize.define('mechanics', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    addressId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Addresses',
            key: 'id',
        },
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


module.exports = Mechanic;