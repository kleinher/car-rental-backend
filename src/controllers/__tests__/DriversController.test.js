const DriversController = require('../DriversController');
const Driver = require('../../models/Driver');
const DriverService = require('../../service/DriverService');
const DriverRepository = require('../../repository/DriverRepository');
const { agregarDB } = require('../../service/GenericService');

// Mock all dependencies
jest.mock('../../models/Driver');
jest.mock('../../service/DriverService');
jest.mock('../../repository/DriverRepository');
jest.mock('../../service/GenericService');
jest.mock('../../config/logger');

describe('DriversController', () => {
    let mockReq;
    let mockRes;

    beforeEach(() => {
        mockReq = {
            params: {},
            body: {}
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('getDrivers', () => {
        it('should return all drivers successfully', async () => {
            const mockDrivers = [{ id: 1, name: 'Test Driver' }];
            DriverService.getAllDrivers.mockResolvedValue(mockDrivers);

            await DriversController.getDrivers(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(mockDrivers);
        });

        it('should handle errors when fetching drivers', async () => {
            DriverService.getAllDrivers.mockRejectedValue(new Error('Database error'));

            await DriversController.getDrivers(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'An error occurred while fetching drivers' });
        });
    });

    describe('getDriverById', () => {
        it('should return a driver when found', async () => {
            const mockDriver = { id: 1, name: 'Test Driver' };
            mockReq.params.id = '1';
            Driver.findById.mockResolvedValue(mockDriver);

            await DriversController.getDriverById(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(mockDriver);
        });

        it('should return 404 when driver not found', async () => {
            mockReq.params.id = '999';
            Driver.findById.mockResolvedValue(null);

            await DriversController.getDriverById(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Driver not found' });
        });
    });

    describe('createDriver', () => {
        it('should create a driver successfully', async () => {
            const driverData = {
                name: 'New Driver',
                phoneNumber: '1234567890',
                address: 'Test Address',
                latitude: 123,
                longitude: 456
            };
            mockReq.body = driverData;

            Driver.build.mockReturnValue(driverData);
            agregarDB.mockResolvedValue('new-id-123');

            await DriversController.createDriver(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith('new-id-123');
        });

        it('should handle errors in driver creation', async () => {
            Driver.build.mockImplementation(() => {
                throw new Error('Validation error');
            });

            await DriversController.createDriver(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'An error occurred while creating the driver' });
        });
    });

    describe('updateDriver', () => {
        it('should update a driver successfully', async () => {
            const updatedDriver = { id: 1, name: 'Updated Driver' };
            mockReq.params.id = '1';
            mockReq.body = { name: 'Updated Driver' };

            DriverRepository.updateDriver.mockResolvedValue(updatedDriver);

            await DriversController.updateDriver(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(updatedDriver);
        });

        it('should return 404 when updating non-existent driver', async () => {
            mockReq.params.id = '999';
            DriverRepository.updateDriver.mockResolvedValue(null);

            await DriversController.updateDriver(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Driver not found' });
        });
    });

    describe('deleteDriver', () => {
        it('should delete a driver successfully', async () => {
            mockReq.params.id = '1';
            DriverRepository.deleteDriver.mockResolvedValue({ id: 1 });

            await DriversController.deleteDriver(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Driver deleted successfully' });
        });

        it('should return 404 when deleting non-existent driver', async () => {
            mockReq.params.id = '999';
            DriverRepository.deleteDriver.mockResolvedValue(null);

            await DriversController.deleteDriver(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Driver not found' });
        });
    });
});
