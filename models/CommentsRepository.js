const Sequelize = require("../sequelize/sequelize.js");
const sequelize = require("sequelize")

const Comentarios = Sequelize.define("comentarios", {
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
    comentario: {
        type: sequelize.TEXT,
        allowNull: false
    },
    post_id: {
        type: sequelize.INTEGER,
        allowNull: false
    }
})

module.exports = Comentarios