const NotificationService = require('../../src/service/NotificationService');
const client = require('../../src/client/whatsapp');
const logger = require('../../src/config/logger');

jest.mock('../../src/client/whatsapp');
jest.mock('../../src/config/logger');

describe('NotificationService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should send a notification successfully', async () => {
        client.sendMessage.mockResolvedValue();

        const number = '123456789';
        const message = 'Hello, World!';
        await NotificationService.sendNotification(number, message);

        expect(client.sendMessage).toHaveBeenCalledWith(`${number}@c.us`, message);
        expect(logger.info).toHaveBeenCalledWith('Mensaje enviado:' + message);
    });

    it('should log an error if sending a notification fails', async () => {
        const error = new Error('Failed to send message');
        client.sendMessage.mockRejectedValue(error);

        const number = '123456789';
        const message = 'Hello, World!';
        await NotificationService.sendNotification(number, message);

        expect(client.sendMessage).toHaveBeenCalledWith(`${number}@c.us`, message);
        expect(logger.error).toHaveBeenCalledWith('Error al enviar mensaje:' + error);
    });
});