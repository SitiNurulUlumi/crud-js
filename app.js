const path = require('path');
const express = require ('express');
const ejs = require('ejs');
const bodyParser = require ('body-parser');
const app = express();
const mysql = require('mysql');
const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'crudd'
});
connection.connect(function(error){
    if(!!error) console.log(error);
    else console.log('Database Terkoneksi');
});

//set views file
app.set('views', path.join(__dirname,'views'));
//set views engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/',(req, res) => {
    let sql = `SELECT username, no_hp, alamat, usernames FROM reseller INNER JOIN login ON reseller.id_admin=login.id_admin`;
    connection.query(sql,(err, data) => {
        if(err) throw err ;
        res.render('user_index', {
            title : 'DATA RESELLER DAN ADMIN',
            seller : data
        });
    });
});

app.get('/admin',(req, res) =>{
    //res.send('DATA RESELLER');
    let sql = "SELECT * FROM login";
    let query = connection.query(sql, (err, logs)=>{
        if(err) throw err;
        res.render('log_index',{
            title : 'DATA ADMIN',
            login : logs
        });
    });
});

app.get('/ress',(req, res) =>{
    //res.send('DATA RESELLER');
    let sql = "SELECT * FROM reseller";
    let query = connection.query(sql, (err, ress)=>{
        if(err) throw err;
        res.render('ress_index',{
            title : 'DATA RESELLER',
            reseller : ress
        });
    });
});

app.get('/add',(req, res) =>{
    res.render('user_add',{
    title : 'DATA RESELLER'
    });
});

app.post('/save',(req, res)=>{
    let data = { username : req.body.username, email: req.body.email, no_hp: req.body.no_hp, alamat: req.body.alamat, id_admin: req.body.id_admin };
    let sql = "INSERT INTO reseller SET ?";
    let query = connection.query(sql, data, (err, results)=>{
        if(err) throw err;
        res.redirect('/ress');
    });
});

app.get('/edit/:id_reseller',(req, res) => {
    const id_reseller = req.params.id_reseller;
    let sql = `Select * from reseller where id_reseller = ${id_reseller}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.render('user_edit', {
            title : 'DATA RESELLER',
            seller : result[0]
        });
    });
});

app.post('/update',(req, res) => {
    const id_reseller = req.body.id_reseller;
    let sql = "update reseller SET username='"+req.body.username+"',  email='"+req.body.email+"',  no_hp='"+req.body.no_hp+"', alamat='"+req.body.alamat+"', id_admin='"+req.body.id_admin+"' where id_reseller ="+id_reseller;
    let query = connection.query(sql,(err, results) => {
      if(err) throw err;
      res.redirect('/ress');
    });
});

///delete
app.get('/delete/:id_reseller',(req,res) => {
    const id_reseller = req.params.id_reseller;
    let sql = `DELETE from reseller where id_reseller = ${id_reseller}`;
    let query = connection.query(sql,(err,result) => {
        if(err) throw err;
        res.redirect('/ress');
    });
});

//Server Listening
app.listen(3000, ()=>{
    console.log('server running at port 3000');
});
