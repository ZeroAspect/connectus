const mysql = require("mysql2")
const sequelize = require("sequelize")
const express = require("express")
const hbs = require("express-handlebars")
const MySQLConnect = require("./mysql/mysql.js")
const IPquery = require("./ip/ip.js")
const Sequelize = require("./sequelize/sequelize.js")
const Users = require("./models/UsersRepository.js")
const app = require("./app/config.js")

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
            ip: ip['query']
        }
    })
    if(users === null){
        res.redirect('/login')
    } else {
        res.render('home')
    }
    // res.json(users)
    console.log(ip['query'])
    
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
    const user = await Users.findOne({
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
        const validation = `
        <div class='alert alert-danger' role='alert'>
            <h4>Olá, pessoa</h4>
            <p>Este email ou senha devem estar errados ou incompletos, pois está havendo um erro ao efetuar o login nesta conta. Por favor, tente inserir caracteres corretos!</p>
            <hr>
            <p class='mb-0'>Nunca iremos compartilhar seu email ou senha com ninguém.</div>
        </div>`
        res.render('login', {
            validation
        })
    } else {
        const [ user ] = await pool.query(`
            UPDATE
            users
            SET
            ip = '${ip['query']}'
            WHERE
            email = '${email}' and senha = '${senha}'
        `)
        console.log(user)
        res.redirect('/')
    }
})

app.get('/cadastro', async(req, res)=>{
    const ip = await IPquery()
    const user = await Users.findOne({
        where: {
            ip: ip['query']
        }
    })
    if(user === null){
        res.render('cadastro')
    } else {
        res.redirect('/')
    }
})

app.post('/cadastro', async(req, res)=>{
    const ip = await IPquery()
    const { nome, email, senha, bio, status, sexo } = await req.body
    console.log(req.body)
    const user = await Users.findOne({
        where: {
            email: email
        }
    })
    if(user!== null){
        const validation = `
        <div class='alert alert-danger' role='alert'>
            <h4>Olá, pessoa</h4>
            <p>Email já está em uso, informe outro email válido!</p>
            <hr>
            <p class='mb-0'>Nunca iremos compartilhar seu email ou senha com ninguém.</div>
            </div>`
        res.render('cadastro', {
            validation
        })
        console.log(user)
    } else {
        const user = await Users.create({
            nome: nome,
            email: email,
            senha: senha,
            bio: bio,
            status: status,
            sexo: sexo,
            ip: ip['query']
        })
        console.log(user)
        res.redirect('/success')
    }
    
})

app.get('/success', async(req, res)=>{
    res.render('success')
})

app.get('/new', async(req, res)=>{
    const ip = await IPquery()
    const user = await Users.findOne({
        where: {
            ip: ip['query']
        }
    })
    if(user === null){
        res.redirect('/login')
    } else {
        res.render('new')
    }
})

