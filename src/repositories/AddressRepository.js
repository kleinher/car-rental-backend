const Address = require('../models/Address');
const logger = require('../config/logger');

class AddressRepository {
    async create(addressData) {
        try {
            return await Address.create(addressData);
        } catch (error) {
            logger.error('Error creating address:', error);
            throw error;
        }
    }
}

module.exports = new AddressRepository();
