const Sequelize = require("../sequelize/sequelize.js");
const sequelize = require("sequelize")

const Posts = Sequelize.define("posts", {
    id: {
        primaryKey: true,
        type: sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false
    },
    nome: {
        type: sequelize.INTEGER,
        allowNull: false
    },
    titulo: {
        type: sequelize.STRING,
        allowNull: false
    },
    conteudo: {
        type: sequelize.TEXT,
        allowNull: false
    },
    fonte: {
        type: sequelize.STRING,
        allowNull: false
    }

})

module.exports = Posts