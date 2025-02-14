const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Address = require('./Address');
const Driver = require('./Driver');
const Mechanic = require('./Mechanic');

class Car extends Model { }

Car.init({
    licencePlate: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'licence_plate'
    },
    kilometers: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'kilometers'
    },
    addressId: {  // FK correcta hacia Address
        type: DataTypes.INTEGER,
        references: {
            model: 'addresses',
            key: 'id'
        },
        allowNull: false,
        field: 'address_id',
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
    },
    estMaintainance: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'est_maintainance'
    },
    lastUpdate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'last_update'
    },
    driverId: {  // FK correcta hacia Driver
        type: DataTypes.INTEGER,
        references: {
            model: 'drivers',
            key: 'id',
        },
        allowNull: true,
        field: 'driver_id',
        onDelete: 'SET NULL'
    },
    mechanicId: {  // FK correcta hacia Mechanic
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'mechanics',
            key: 'id',
        },
        field: 'mechanic_id',
        onDelete: 'SET NULL',
    },
    inMaintenance: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'in_maintenance'
    },
    lastMaintainance: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'last_maintainance'
    },
}, {
    sequelize,
    modelName: 'Car',
    tableName: 'cars',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        { fields: ['address_id'] },
        { fields: ['driver_id'] },
        { fields: ['mechanic_id'] }
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
