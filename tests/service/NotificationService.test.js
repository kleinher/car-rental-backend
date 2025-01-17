const NotificationService = require('../../src/service/NotificationService');
const WhatsappClient = require('../../src/client/WhatsappClient');
const logger = require('../../src/config/logger');

jest.mock('../../src/client/WhatsappClient');
jest.mock('../../src/config/logger');

describe('NotificationService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should send a notification successfully', async () => {
        WhatsappClient.sendMessage.mockResolvedValue();

        const number = '123456789';
        const message = 'Hello, World!';
        await NotificationService.sendNotification(number, message);

        expect(WhatsappClient.sendMessage).toHaveBeenCalledWith(`${number}@c.us`, message);
        expect(logger.info).toHaveBeenCalledWith('Mensaje enviado:' + message);
    });

    it('should log an error if sending a notification fails', async () => {
        const error = new Error('Failed to send message');

        WhatsappClient.sendMessage.mockRejectedValue(error);

        const number = '123456789';
        const message = 'Hello, World!';
        await expect(NotificationService.sendNotification(number, message)).rejects.toThrow(error);

        expect(WhatsappClient.sendMessage).toHaveBeenCalledWith(`${number}@c.us`, message);
        expect(logger.error).toHaveBeenCalledWith('Error al enviar mensaje:' + error);

    });
});