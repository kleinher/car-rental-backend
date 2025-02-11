const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Address = require('./Address');

class Mechanic extends Model { }

Mechanic.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    addressId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'addresses',
            key: 'id',
        },
        allowNull: false,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Mechanic',
    tableName: 'mechanics',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
});

// Relación con Address
Mechanic.belongsTo(Address, {
    foreignKey: 'addressId',
    as: 'address',
});

module.exports = Mechanic;
