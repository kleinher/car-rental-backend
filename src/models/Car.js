const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequialize');

const Car = sequelize.define('Car', {
    licencePlate: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    kilometers: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    latitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    longitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    driverId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Drivers',
            key: 'id',
        },
        allowNull: true,
    },
}, {
    timestamps: true,
});
Car.prototype.agregar = async function () {
    try {
        const newCar = await this.save();
        console.log('Driver agregado a la base de datos:', newCar);
        return newCar;
    } catch (error) {
        console.error('Error al agregar el driver:', error);
        throw error;
    }
};

module.exports = Car;