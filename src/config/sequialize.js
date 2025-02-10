const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite',
    logging: false,
});

sequelize.sync({ force: true }).then(async () => {
    const seedsDir = path.join(__dirname, '../resources/seeds');
    const seedFiles = fs.readdirSync(seedsDir).sort();

    for (const file of seedFiles) {
        if (file.endsWith('.sql')) {
            const sql = fs.readFileSync(path.join(seedsDir, file), 'utf8');
            await sequelize.query(sql);
        }
    }
    console.log('Database seeded successfully');
}).catch((error) => {
    console.error('Error seeding database:', error);
});

module.exports = sequelize;
