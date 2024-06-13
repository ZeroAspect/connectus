const sequelize = require("sequelize")

const Sequelize = new sequelize.Sequelize({
    username: 'root',
    password: 'TuWIXKMPtamgkVuONTHnnOUgmosFAdLy',
    host: 'roundhouse.proxy.rlwy.net',
    port: 26427,
    dialect: 'mysql',
    database: 'railway'
})

module.exports = Sequelize