const Sequelize = require("../sequelize/sequelize.js");
const sequelize = require("sequelize")

const Users = Sequelize.define("users", {
    id: {
        primaryKey: true,
        type: sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false
    },
    nome: {
        type: sequelize.STRING,
        allowNull: false
    },
    email: {
        type: sequelize.STRING,
        allowNull: false
    },
    senha: {
        type: sequelize.STRING,
        allowNull: false
    },
    sexo: {
        type: sequelize.STRING,
        allowNull: false
    },
    status: {
        type: sequelize.STRING,
        allowNull: false
    },
    ip: {
        type: sequelize.STRING,
        allowNull: false
    }
})

module.exports = Users