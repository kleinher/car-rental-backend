const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequialize');
const Address = require('./Address');

const Car = sequelize.define('Cars', {
    licencePlate: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    kilometers: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    addressId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'addresses',
            key: 'id'
        },
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
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
            model: 'drivers',
            key: 'id',
        },
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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
    indexes: [
        { fields: ['addressId'] },
        { fields: ['driverId'] }
    ]
});

Car.belongsTo(Address, {
    foreignKey: 'addressId',
    as: 'address'
});

module.exports = Car;