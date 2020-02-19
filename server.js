// configurando o servidor
const express = require("express")
const server = express()

//configurar o servidor para apresentar arquivos est�ticos
server.use(express.static('public'))

//habilitar body do formulario

server.use(express.urlencoded({ extended: true }))

//Configurar Banco de Dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '512089',
    host: 'localhost',
    port: '5432',
    database:'doe',

})

//configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {

    express: server,
    noCache:true,

})

//lista de doadores


//configurar a apresenta��o da p�gina
server.get("/", function (req, res) {

    db.query("SELECT * FROM donors", function (err, result) { 

        if (err) return res.send("Erro de Banco de Dados.")

        const donors = result.rows

        return res.render("index.html", { donors })

    })
})

server.post("/", function (req, res){
    //pegar os dados do formul�rio
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == "" || email == "" || blood == ""){
        return res.send("Todos os campos devem ser preenchidos")
    }

    //Colocar valores dentro do banco de dados
    const query = `INSERT INTO donors ("name","email","blood")
                   VALUES($1,$2,$3)`

    const values = [name, email, blood]
    db.query(query, values, function (err) {

        //fluxo de erro
        if (err) return res.send("erro no banco de dados")

        //fluxo ideal
        return res.redirect("/")

    })

    
})

// ligar o servidor e permitir acesso na porta 3000
server.listen(3000, function () {

        console.log('Servidor Iniciado!')

})
