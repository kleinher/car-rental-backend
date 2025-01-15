// suma.js
function suma(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
        throw new Error('Ambos argumentos deben ser números');
    }
    return a + b;
}

module.exports = suma;
