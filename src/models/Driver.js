const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Address = require('./Address');

class Driver extends Model { }

Driver.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'name'
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'phone_number'
    },
    addressId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'addresses',
            key: 'id'
        },
        field: 'address_id'
    }
}, {
    sequelize,
    modelName: 'Driver',
    tableName: 'drivers',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Relación con Address
Driver.belongsTo(Address, {
    foreignKey: 'addressId',
    targetKey: 'id',
    as: 'address',
});

module.exports = Driver;
