//biblioteca do express
const express = require('express');
//biblioteca do sql
const sql = require('mssql')

const app = express();
const port = 3000 
app.use(express.json())    

const config = {
    server: 'MSI', 
    database: 'curriculos', //nome do Database em uso
    port:1433,
    //password: ''
    user: 'MSI/henri', //nome do user em uso
    trustServerCertificate:true,


    options: {
        cryptoCredentialsDetails: {
            minVersion: 'TLSv1',
            trustServerCertificate: true,
        }
    }   
  } 

//fazendo a conexão
sql.connect(config)
    .then(conn => global.conn = conn)
    .catch(err => console.log(err))

function execSQLQuery(sqlQry, res){
  global.conn.request()
              .query(sqlQry)
              .then(result => res.json(result.recordset))
              .catch(err => res.json(err));
}

//criação da tabela
async function CreatTable() {
    try {
        await sql.connect;

        //criação da tabela e seu nome
        const table = new sql.Table("tabela generica");
        table.create = true; 
        
        //colunas da tabela
        table.columns.add("ID", sql.Int, {nullable: false, primary: true});
        table.columns.add("Nome", sql.NVarChar(150), {nullable:false});

        //componentes da tabela
        table.rows.add(1, "Victor");
        table.rows.add(2, "Mateus");
        table.rows.add(3, "Rafael");
        table.rows.add(4, "Eric");
        
        //confirmação da criação
        const request = new sql.Request();
        await request.bulk(table);
        console.log("table criada");
    }
    catch(err){
        console.error(err)
    }
}
CreatTable()

//criação do cadastro
app.post("/Cadastro", async (req, res) => { 
    const {cref, nome, data_nascimento , pcd, genero_id, estado, cidade, experiencia, resumo_profissional} = req.body;
    await execSQLQuery(`EXEC CadastrarUsuario 
        @cref = '${cref}', 
        @nome = '${nome}', 
        @data_nascimento = '${data_nascimento}', 
        @pcd = ${pcd}, 
        @genero_id = ${genero_id}, 
        @estado = '${estado}', 
        @cidade = '${cidade}', 
        @experiencia = ${experiencia}, 
        @resumo_profissional = '${resumo_profissional}';`);
    res.sendStatus(201);
})

//alteração do cadastro apartir de id
app.put("/Cadastro/", async (req, res) => {
    const {cref, nome, data_nascimento , pcd, genero_id, estado, cidade, experiencia, resumo_profissional} = req.body;
    await execSQLQuery(`UPDATE CadastrarUsuario SET
        @cref = '${cref}', 
        @nome = '${nome}', 
        @data_nascimento = '${data_nascimento}', 
        @pcd = ${pcd}, 
        @genero_id = ${genero_id}, 
        @estado = '${estado}', 
        @cidade = '${cidade}', 
        @experiencia = ${experiencia}, 
        @resumo_profissional = '${resumo_profissional}'; WHERE ID=${id}`);
res.sendStatus(200);
})

//deletar cadastro apartir de id
app.delete("/Cadastro/", async (req, res) => {
    const id = parseInt(req.params.id);
    await execSQLQuery(`{DELETE CadastrarUsuario WHERE ID=${id}`);
    res.sendStatus(200);
})

//mostra cadastro feito por id
app.get("/Cadastro/", async (req, res) =>{  
    const id = parseInt(req.params.id);
    const result = await execSQLQuer("SELECT * FROM cadastro WHERE ID=" + id);
    res.json(result);
})

//mostras os cadastros feitos
app.get("/Cadastro", async (req, res) =>{  
    const result = await execSQLQuer("SELECT * FROM cadastro");
    res.json(result);
})


