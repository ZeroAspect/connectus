const mysql = require("mysql2")
const sequelize = require("sequelize")
const express = require("express")
const hbs = require("express-handlebars")
const MySQLConnect = require("./mysql/mysql.js")
const IPquery = require("./ip/ip.js")
const Sequelize = require("./sequelize/sequelize.js")
const Users = require("./models/UsersRepository.js")
const app = require("./app/config.js")
const Posts = require("./models/PostsRepository.js")
const { marked } = require("marked")
const Comentarios = require("./models/CommentsRepository.js")

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
        const user = await Users.findOne({
            where: {
                ip: ip['query']
            }
        })
        const [rows, results] = await pool.query(`SELECT * FROM posts ORDER BY id DESC`)
        res.render('home', {
            nome: user['nome'],
            posts: rows
        })
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
            nome: nome,
            email: email
        }
    })
    if(user!== null){
        const validation = `
        <div class='alert alert-danger' role='alert'>
            <h4>Olá, pessoa</h4>
            <p>Email ou nome já está em uso, informe outro email ou senha válido!</p>
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
            bio: marked(bio),
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
        res.render('new', { nome: user['nome'] })
    }
})

app.post('/new', async(req, res)=>{
    const ip = await IPquery()
    const { title, content, fonte } = req.body
    const user = await Users.findOne({
        where: {
            ip: ip['query']
        }
    })
    console.log('user')
    if(user === null){
        res.redirect('/login')
    } else {
        const post = await Posts.create({
            nome: user['nome'],
            titulo: title,
            conteudo: marked(content),
            fonte: fonte

        })
        console.log(user)
        res.redirect('/new/success')
        console.log(post)
    }
})

app.get('/new/success', async(req, res)=>{
    res.render('new/success')
})

app.get('/:nome/conteudos', async(req, res)=>{
    const ip = await IPquery()
    const user = await Users.findOne({
        where: {
            ip: ip['query']
        }
    })
    if(user === null){
        res.redirect('/login')
    } else {
        const [ rows, results ] = await pool.query(`SELECT * FROM posts WHERE nome = '${req.params.nome}'`)
        const posts = await Posts.findAll({
            where: {
                nome: req.params.nome
            }
        })
        console.log(rows)
        res.render('profile/contents', {
            rows,
            nome: req.params.nome
        })
    }
})

app.get('/settings', async(req, res)=>{
    const ip = await IPquery()
    const user = await Users.findOne({
        where: {
            ip: ip['query']
        }
    })
    console.log(user)
    if(user === null){
        res.redirect('/login')
    } else {
        const [ rows, results ] = await pool.query(`SELECT * FROM users WHERE nome = '${user['nome']}'`)
        
        res.render('profile/editProfile', {
            rows
        })
    }
})

app.post('/settings', async(req, res)=>{
    const ip = await IPquery()
    const user = await Users.findOne({
        where: {
            ip: ip['query']
        }
    })
    console.log(user)
    if(user === null){
        res.redirect('/login')
    } else {
        const { nome, email, senha, bio } = req.body
        const update = await Users.update({
            nome: nome,
            email: email,
            senha: senha,
            bio: marked(bio)
        },
        {
            where: {
                nome: user['nome']
            }
        })
        console.log(update)
        res.redirect('/settings')
    }
})

app.get("/:nome", async(req, res)=>{
    const ip = await IPquery()
    const user = await Users.findOne({
        where: {
            ip: ip['query']
        }
    })
    if(user === null){
        res.redirect('/login')
    } else {
        const [ rows, results ] = await pool.query(`SELECT * FROM users WHERE nome = '${req.params.nome}'`)
        res.render('profile/profile', {
            rows,
            nome: req.params.nome
        })
    }
})

app.get('/:nome/:titulo', async(req, res)=>{
    const ip = await IPquery()
    const user = await Users.findOne({
        where: {
            ip: ip['query']
        }
    })
    if(user === null){
        res.redirect('/login')
    } else {
        const [ rows, results ] = await pool.query(`SELECT * FROM posts WHERE titulo = '${req.params.titulo}'`)
        const post_id = rows[0]['id']
        console.log(rows[0]['id'])
        // const comment = await Comentarios.findAll({
        //     where: {
        //         post_id: 
        //     }
        // })
        const [ comentarios, result ] = await pool.query(`SELECT * FROM comentarios WHERE post_id = ${post_id}`)
        res.render('post/post', {
            rows,
            nome: req.params.nome,
            titulo: req.params.titulo,
            comentarios
        })
    }
})

app.post('/:nome/:titulo', async(req, res)=>{
    const ip = await IPquery()
    const user = await Users.findOne({
        where: {
            ip: ip['query']
        }
    })
    if(user === null){
        res.redirect('/login')
    } else {
        const { comentario } = req.body
        const post = await Posts.findOne({
            where: {
                titulo: req.params.titulo
            }
        })
        const comment = await Comentarios.create({
            nome: user['nome'],
            comentario: marked(comentario),
            post_id: post['id']
        })
        res.redirect(`/${req.params.nome}/${req.params.titulo}`)
    }
})