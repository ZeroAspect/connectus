const mysql = require("mysql2")
const sequelize = require("sequelize")
const express = require("express")
const hbs = require("express-handlebars")

const app = express()

app.get("/", (req, res)=>{
    res.send("hello")
})

app.listen(3000, ()=>{
    console.log({
        message: "success"
    })
})