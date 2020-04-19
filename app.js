var express     = require('express');
var bodyParser  = require('body-parser');
var pg          = require('pg');

var con = new pg.Client({
    host:"localhost",
    port:"5432",
    user:"postgres",
    password:"root",
    database:"employee"
});

con.connect().then(()=>console.log('connected to db')).catch((err)=>console.log(err))

var app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

var store;

app.post('/addEmp',async(req,res)=>{
     try {
          await con.query('CREATE TABLE IF NOT EXISTS emp(id serial primary key,name varchar)')
          store = await con.query('INSERT INTO emp(name) VALUES($1)',[req.body.name]);
          res.json({msg:'row inserted '+store.rowCount});
     } catch (error) {
         res.json({error:error});
     }
});

app.get('/showEmp',async(req,res)=>{
 try {
  var x =[];
  store = await con.query('SELECT * FROM emp');
  store.rows.forEach(element => {
      x.push({name:element.name});
  });
  res.json({data:x});
 } catch (error) {
     res.json({error:errror});
 }
});

app.put('/updateEmp',async(req,res)=>{
     try {
         store = con.query('UPDATE emp SET name=$1 WHERE id=$2',[req.body.name,req.body.id]);
         res.json({msg:'row updated '+(await store).rowCount});
     } catch (error) {
         res.json({error:error});
     }
});

app.delete('/deleteEmp/:id',async(req,res)=>{
        try {
            store = con.query('DELETE FROM emp WHERE id=$1',[req.params.id]);
            res.json({msg:'row deleted '+(await store).rowCount});
        } catch (error) {
            res.json({error:error});
        }
});

app.listen(3000,()=>console.log('server run at port 3000'));