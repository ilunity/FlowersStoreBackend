const {Sequelize} = require('sequelize');

module.exports = new Sequelize(
    process.env.DATABASE_URL,
    {
        // host: process.env.DB_HOST,
        // port: process.env.DB_PORT,
        dialect: 'postgres',
        protocol: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    }
);