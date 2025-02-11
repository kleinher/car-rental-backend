const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Address = require('./Address');

class Driver extends Model { }

Driver.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    addressId: {  // FK correcta hacia Address
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'addresses',
            key: 'id'
        }
    }
}, {
    sequelize,
    modelName: 'Driver',
    tableName: 'drivers',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
});

// Relación con Address
Driver.belongsTo(Address, {
    foreignKey: 'addressId',
    as: 'address',
});

module.exports = Driver;
