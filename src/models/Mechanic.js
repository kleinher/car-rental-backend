const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Address = require('./Address');

class Mechanic extends Model { }

Mechanic.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'name'
    },
    addressId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'addresses',
            key: 'id',
        },
        allowNull: false,
        field: 'address_id'
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'phone_number'
    },
}, {
    sequelize,
    modelName: 'Mechanic',
    tableName: 'mechanics',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Relación con Address
Mechanic.belongsTo(Address, {
    foreignKey: 'addressId',
    as: 'address',
});

module.exports = Mechanic;
