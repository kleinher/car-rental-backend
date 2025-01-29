// db.js
const { Sequelize } = require('sequelize');

// Configurar la base de datos SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite', // Archivo SQLite
    logging: false,            // Opcional: deshabilita los logs de SQL
});

module.exports = sequelize;
