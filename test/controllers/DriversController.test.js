const { createDriver } = require('../../src/controllers/DriversController');
const Driver = require('../../src/models/Driver');
const { agregarDB } = require('../../src/service/GenericService');

jest.mock('../../src/models/Driver', () => ({
    build: jest.fn()
}));
jest.mock('../../src/service/GenericService', () => ({
    agregarDB: jest.fn()
}));


describe('DriversController - createDriver', () => {
    let req;
    let res;

    beforeEach(() => {
        req = {
            body: {
                name: 'Test Driver',
                phoneNumber: '1234567890',
                latitude: 40.7128,
                longitude: -74.0060
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should create a driver successfully', async () => {
        const mockDriver = {
            ...req.body
        };

        Driver.build.mockReturnValue(mockDriver);
        agregarDB.mockResolvedValue(mockDriver);

        await createDriver(req, res);

        expect(Driver.build).toHaveBeenCalledWith(expect.objectContaining({
            name: 'Test Driver',
            phoneNumber: '1234567890',
            latitude: 40.7128,
            longitude: -74.0060
        }));
        expect(agregarDB).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining(mockDriver));
    });

    test('should handle errors when creating a driver', async () => {
        const errorMessage = 'Database error';
        Driver.build.mockImplementation(() => {
            throw new Error(errorMessage);
        });

        await createDriver(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: 'An error occurred while creating the driver'
        });
    });
});
