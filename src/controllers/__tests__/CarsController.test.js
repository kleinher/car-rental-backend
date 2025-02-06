const request = require('supertest');
const express = require('express');
const CarService = require('../../service/CarService');

// Mock CarService
jest.mock('../../service/CarService');

// Create express app for testing
const app = express();
app.use(express.json());
const carRouter = require('../../routes/carRoutes');
app.use('/cars', carRouter);

describe('CarsController', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    describe('POST /cars/maintainance/end', () => {
        it('should end car maintenance successfully', async () => {
            CarService.endMaintenance.mockResolvedValue();

            const response = await request(app)
                .post('/cars/maintainance/end')
                .send({ licencePlate: 'ABC123' });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Car maintenance ended successfully');
            expect(CarService.endMaintenance).toHaveBeenCalledWith('ABC123');
        });

        it('should return 400 when license plate is missing', async () => {
            const response = await request(app)
                .post('/cars/maintainance/end')
                .send({});

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Missing license plate');
        });

        it('should return 404 when car is not found', async () => {
            CarService.endMaintenance.mockRejectedValue(new Error('Car not found'));

            const response = await request(app)
                .post('/cars/maintainance/end')
                .send({ licencePlate: 'NOTFOUND' });

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Car not found');
        });
    });

    describe('POST /cars', () => {
        it('should create car successfully', async () => {
            const mockCar = {
                id: 1,
                licencePlate: 'ABC123',
                kilometers: '50000',
                latitude: -34.603722,
                longitude: -58.381592,
                address: 'Test Address 123',
                estMaintainance: '2023-12-31',
                driverId: 1,
                inMaintenance: false,
                lastUpdate: new Date().toISOString()
            };
            CarService.createCar.mockResolvedValue(mockCar);

            const response = await request(app)
                .post('/cars')
                .send(mockCar);

            expect(response.status).toBe(201);
            expect(response.body).toEqual(mockCar);
        });

        it('should return 400 when required fields are missing', async () => {
            const response = await request(app)
                .post('/cars')
                .send({ kilometers: '50000' });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Missing required fields');
        });
    });

    describe('PUT /cars/:id', () => {
        it('should update car successfully', async () => {
            const mockCar = {
                id: 1,
                licencePlate: 'ABC123',
                kilometers: '51000',
                latitude: -34.603722,
                longitude: -58.381592,
                address: 'Updated Address 123',
                estMaintainance: '2023-12-31',
                driverId: 1,
                inMaintenance: false,
                lastUpdate: new Date().toISOString()
            };
            CarService.updateCar.mockResolvedValue(mockCar);

            const response = await request(app)
                .put('/cars/1')
                .send(mockCar);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockCar);
        });
    });

    describe('DELETE /cars/:id', () => {
        it('should delete car successfully', async () => {
            CarService.deleteCar.mockResolvedValue();

            const response = await request(app)
                .delete('/cars/1');

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Car deleted successfully');
        });
    });

    describe('GET /cars/:id', () => {
        it('should get car successfully', async () => {
            const mockCar = {
                id: 1,
                licencePlate: 'ABC123',
                model: 'Toyota',
                year: 2020
            };
            CarService.getCar.mockResolvedValue(mockCar);

            const response = await request(app)
                .get('/cars/1');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockCar);
        });

        it('should return 404 when car is not found', async () => {
            CarService.getCar.mockRejectedValue(new Error('Car not found'));

            const response = await request(app)
                .get('/cars/999');

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Car not found');
        });
    });

    describe('GET /cars', () => {
        it('should get all cars successfully', async () => {
            const mockCars = [
                {
                    id: 1,
                    licencePlate: 'ABC123',
                    kilometers: '50000',
                    latitude: -34.603722,
                    longitude: -58.381592,
                    address: 'Test Address 123',
                    estMaintainance: '2023-12-31',
                    driverId: 1,
                    inMaintenance: false,
                    lastUpdate: new Date().toISOString()
                },
                {
                    id: 2,
                    licencePlate: 'XYZ789',
                    kilometers: '30000',
                    latitude: -34.603722,
                    longitude: -58.381592,
                    address: 'Test Address 456',
                    estMaintainance: '2023-12-31',
                    driverId: 2,
                    inMaintenance: false,
                    lastUpdate: new Date().toISOString()
                }
            ];

            CarService.getAllCars.mockResolvedValue(mockCars);

            const response = await request(app)
                .get('/cars');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockCars);
        });

        it('should handle errors when getting all cars', async () => {
            CarService.getAllCars.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .get('/cars');

            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Database error');
        });
    });
});
