const express = require('express');
const sql = require('mssql')

const app = express();
const port = 3000 
app.use(express.json())


const config = {
    server: 'MSI',
    user: 'sa', //nome do user em uso
    password: '',
    port:1433,
    database: 'curriculos', //nome do Database em uso
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

app.listen(port, () => {
    console.log('API running in port 3000')
});

