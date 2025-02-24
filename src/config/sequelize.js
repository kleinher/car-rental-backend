const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

console.log(process.env.DATABASE_URL);
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
        ssl: process.env.NODE_ENV === 'PROD' ? {
            require: true,
            rejectUnauthorized: false // 🚨 Necesario para Railway
        } : false
    }
});

const initializeDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Conectado a PostgreSQL en Railway');

        // Sincronizar la base de datos
        await sequelize.sync({ force: true }); // ⚠ Esto borra los datos en cada inicio
        console.log('📌 Base de datos sincronizada correctamente en PostgreSQL');

        // Ejecutar seeds
        const seedsDir = path.join(__dirname, '../resources/seeds');
        const seedFiles = fs.readdirSync(seedsDir).sort();

        for (const file of seedFiles) {
            if (file.endsWith('.sql')) {
                const sql = fs.readFileSync(path.join(seedsDir, file), 'utf8');
                await sequelize.query(sql);
                console.log(`✅ Seed ejecutado: ${file}`);
            }
        }

        console.log('📌 Seeds ejecutados correctamente');
    } catch (error) {
        console.error('❌ Error inicializando la base de datos:', error);
    }
};

// Llamar a la función para inicializar la base de datos
initializeDatabase();

module.exports = sequelize;
