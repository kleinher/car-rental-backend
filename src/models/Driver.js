// models/Driver.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequialize');

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

module.exports = Driver;
