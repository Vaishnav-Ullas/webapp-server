const express = require('express')
const app = express()
const port = 8000
var mysql = require('mysql')
var bodyParser = require('body-parser')
var cors = require('cors')
app.use(cors());
app.options('*', cors());

var connection = initializeConnection({
  host     : 'sql12.freemysqlhosting.net',
  user     : 'sql12294547',
  password : 'clv516meCZ',
  database : 'sql12294547',
  port     : '3306'
});

function initializeConnection(config) {
  function addDisconnectHandler(connection) {
      connection.on("error", function (error) {
          if (error instanceof Error) {
              if (error.code === "PROTOCOL_CONNECTION_LOST") {
                  console.error(error.stack);
                  console.log("Lost connection. Reconnecting...");

                  initializeConnection(connection.config);
              } else if (error.fatal) {
                  throw error;
              }
          }
      });
  }

  var connection = mysql.createConnection(config);

  addDisconnectHandler(connection);

  connection.connect();
  return connection;
}

app.use( bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function(req, res){
 
  var sql1="SELECT * FROM `users`";


  connection.query(sql1, function (err, rows, fields) {
    if (err) throw(err);
  
    console.log('The solution is: ', rows)
  })
res.send('Hello World!')
})

app.post('/signup', function(req, res){
  var body1=req.body;
  var sql="INSERT INTO users(username, password) VALUES (?,?)";
  var obj = [body1.username,body1.password]
  connection.query(sql,obj, function (err, rows, fields) {
    if (err) {
      res.send({x:"user already exist"})
    }
    else{
      res.send({x:"Registration sucess"});
    }
  })
 
})

app.post('/login', function(req, res){
  var body2=req.body;
  var sql="SELECT password FROM users WHERE username=?";
  connection.query(sql,body2.username, function (err, rows, fields) {
    if (err) {
      res.send({x:"error"})
    }
    else if(rows[0]==undefined){
      res.send({x:"incorrect username"})
    }
    else if(body2.password!=rows[0].password){
      res.send({x:"incorrect password"});
    }
    else{
      res.send({x:"sucess"})
    }
  })

 
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))