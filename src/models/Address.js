const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class Address extends Model { }

Address.init({
    formattedAddress: {
        type: DataTypes.STRING,
        allowNull: false
    },
    latitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    longitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'Address',
    tableName: 'addresses',
    timestamps: false
});

module.exports = Address;
