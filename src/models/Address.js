const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class Address extends Model { }

Address.init({
    formatted_address: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'formatted_address'
    },
    latitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: 'latitude'
    },
    longitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: 'longitude'
    }
}, {
    sequelize,
    modelName: 'Address',
    tableName: 'addresses',
    timestamps: false
});

module.exports = Address;
