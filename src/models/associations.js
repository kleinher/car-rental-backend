const Driver = require('./Driver');
const Address = require('./Address');

const setupAssociations = () => {
    Address.belongsTo(Driver, {
        foreignKey: 'driverId',
        as: 'driver'
    });

    Driver.hasOne(Address, {
        foreignKey: 'addressId',
        as: 'address'
    });

};

module.exports = setupAssociations;
