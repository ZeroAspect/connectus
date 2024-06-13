const mysql = require("mysql2")
const sequelize = require("sequelize")
const express = require("express")
const hbs = require("express-handlebars")
const MySQLConnect = require("./mysql/mysql.js")
const IPquery = require("./ip/ip.js")
const Sequelize = require("./sequelize/sequelize.js")
const Users = require("./models/UsersRepository.js")
const app = express()

// body parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.engine('handlebars', hbs.engine())
app.set('view engine', 'handlebars')
app.set('views', './views')

const pool = MySQLConnect()
app.get("/", async(req, res)=>{
    const ip = await IPquery()
    const [ rows, results ] = await pool.query(`SELECT * FROM users`)
    const users = await Users.findOne({
        where: {
            ip: ip['ip']
        }
    })
    if(users === null){
        res.redirect('/login')
    } else {
        res.render('home')
    }
    // res.json(users)
    console.log(ip['ip'])
    
})

app.get('/login', async(req, res)=>{
    // res.json({
    //     route: '/login'
    // })
    res.render('login')
})

app.post('/login', async(req, res)=>{
    const ip = await IPquery()
    const { email, senha } = await req.body
    const user = Users.findOne({
        where: {
            email: email,
            senha: senha
        }
    })
    if(user === null){
        const typeAlert = "alert alert-danger"
        const title = "Olá, pessoa"
        const notify1 = "Este email ou senha devem estar errados ou incompletos, pois está havendo um erro ao efetuar o login nesta conta. Por favor, tente inserir caracteres corretos!"
        const notify2 = "Nunca iremos compartilhar seu email ou senha com ninguém."
        res.render('login', {
            typeAlert: typeAlert,
            title: title,
            notify1: notify1,
            notify2: notify2
        })
    } else {
        const [ user ] = await pool.query(`
            UPDATE
            users
            SET
            ip = '${ip['ip']}'
            WHERE
            email = '${email}' and senha = '${senha}'
        `)
        console.log(user)
        res.redirect('/')
    }
})

app.listen(3000, ()=>{
    console.log({
        message: "success"
    })
})