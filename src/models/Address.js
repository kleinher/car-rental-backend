const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequialize');
const Driver = require('./Driver'); // Importar aquí después de definir Driver

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

Driver.hasOne(Address, {
    foreignKey: 'addressId',
    as: 'address'
});

Address.belongsTo(Driver, {
    foreignKey: 'addressId',
    as: 'driver'
});

module.exports = Address;
