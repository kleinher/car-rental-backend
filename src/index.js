
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'mysql'
});

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

sequelize.sync({ force: true }).then(() => {
    const sql = fs.readFileSync(path.join(__dirname, 'resources/data.sql'), 'utf8');
    return sequelize.query(sql);
}).then(() => {
    console.log('Database seeded successfully');
}).catch((error) => {
    console.error('Error seeding database:', error);
});

module.exports = User;
