const Address = require('../../models/Address.js');
const logger = require('../../config/logger.js');

module.exports = {
    async createAddress(req) {
        logger.debug('Creating new driver address');
        const address = {
            formattedAddress: req.body.address,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
        };
        const driverAddress = await Address.create(address);
        logger.debug(`Created address: ${JSON.stringify(address)}`);
        return driverAddress;
    }
};