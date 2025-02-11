const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequialize');
const Address = require('./Address');
const Driver = require('./Driver');
const Mechanic = require('./Mechanic');

class Car extends Model { }

Car.init({
    licencePlate: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    kilometers: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    addressId: {  // FK correcta hacia Address
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
    driverId: {  // FK correcta hacia Driver
        type: DataTypes.INTEGER,
        references: {
            model: 'drivers',
            key: 'id',
        },
        allowNull: true,
        onDelete: 'SET NULL'
    },
    mechanicId: {  // FK correcta hacia Mechanic
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Mechanic,
            key: 'id',
        },
        onDelete: 'SET NULL',
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
    sequelize,
    modelName: 'Car',
    tableName: 'cars',
    timestamps: true,
    indexes: [
        { fields: ['addressId'] },
        { fields: ['driverId'] },
        { fields: ['mechanicId'] }
    ]
});

// Relaciones corregidas
Car.belongsTo(Address, {
    foreignKey: 'addressId',
    as: 'address'
});

Car.belongsTo(Driver, {
    foreignKey: 'driverId',  // ✅ Clave foránea correcta
    as: 'driver'
});

Car.belongsTo(Mechanic, {
    foreignKey: 'mechanicId',
    as: 'mechanic'
});

module.exports = Car;
