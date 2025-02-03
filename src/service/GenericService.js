async function agregarDB(item) {
    if (item && typeof item.agregar === 'function') {
        return await item.agregar();
    } else {
        throw new Error("El objeto no implementa el método agregar()");
    }
}

module.exports = { agregarDB };