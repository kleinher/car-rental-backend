const Driver = require('./Driver');
const Address = require('./Address');

const setupAssociations = () => {
    Driver.belongsTo(Address, {
        foreignKey: 'AddressId',
        as: 'address'
    });

    Address.hasMany(Driver, {
        foreignKey: 'AddressId',
        as: 'drivers'
    });
};

module.exports = setupAssociations;
