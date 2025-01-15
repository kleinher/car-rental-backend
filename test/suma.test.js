// suma.test.js
const suma = require('../src/suma');

test('Suma 2 + 3 debe ser 5', () => {
    expect(suma(2, 3)).toBe(5);
});

test('Lanza un error si los argumentos no son números', () => {
    expect(() => suma(2, '3')).toThrow('Ambos argumentos deben ser números');
});
