const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequialize');

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
    timestamps: true
});

module.exports = Driver;
