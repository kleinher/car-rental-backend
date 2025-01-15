const NotificationController = require('../../src/controllers/NotificationController');
const notificationService = require('../../src/service/NotificationService');
const { setDataWithCache } = require('../../src/service/UpdateService');
const logger = require('../../src/config/logger');

jest.mock('../../src/service/NotificationService');
jest.mock('../../src/service/UpdateService');
jest.mock('../../src/config/logger');

describe('NotificationController', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('sendNotification', () => {
        it('should return 400 if required fields are missing', async () => {
            req.body = { number: '1234567890' }; // Missing message and licencePlate

            await NotificationController.sendNotification(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Missing required fields' });
        });

        it('should send notification and return 200 if all fields are provided', async () => {
            req.body = { number: '1234567890', message: 'Test message', licencePlate: 'ABC123' };

            notificationService.sendNotification.mockResolvedValue();
            setDataWithCache.mockResolvedValue();

            await NotificationController.sendNotification(req, res);

            expect(notificationService.sendNotification).toHaveBeenCalledWith('1234567890', 'Test message');
            expect(setDataWithCache).toHaveBeenCalledWith('1234567890', 'ABC123');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Notification sent successfully' });
        });

        it('should return 500 if there is an error', async () => {
            req.body = { number: '1234567890', message: 'Test message', licencePlate: 'ABC123' };

            const error = new Error('Test error');
            notificationService.sendNotification.mockRejectedValue(error);

            await NotificationController.sendNotification(req, res);

            expect(logger.error).toHaveBeenCalledWith('Error sending notification:', error);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
        });
    });
});