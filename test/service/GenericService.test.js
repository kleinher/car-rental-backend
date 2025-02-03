const { agregarDB } = require('../../src/service/GenericService');

describe('GenericService', () => {
    describe('agregarDB', () => {
        test('should call agregar method if item implements it', async () => {
            // Crear mock objeto con método agregar
            const mockItem = {
                agregar: jest.fn().mockResolvedValue({ id: 1, name: 'Test' })
            };

            const result = await agregarDB(mockItem);

            expect(mockItem.agregar).toHaveBeenCalled();
            expect(result).toEqual({ id: 1, name: 'Test' });
        });

        test('should throw error if item does not implement agregar method', async () => {
            // Objeto sin método agregar
            const invalidItem = {
                someOtherMethod: () => { }
            };

            await expect(agregarDB(invalidItem))
                .rejects
                .toThrow('El objeto no implementa el método agregar()');
        });

        test('should throw error if item is null', async () => {
            await expect(agregarDB(null))
                .rejects
                .toThrow('El objeto no implementa el método agregar()');
        });

        test('should throw error if agregar method fails', async () => {
            const mockItem = {
                agregar: jest.fn().mockRejectedValue(new Error('Database error'))
            };

            await expect(agregarDB(mockItem))
                .rejects
                .toThrow('Database error');
        });
    });
});
