const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('dream.db');
const ejs = require('ejs');
let page = ejs.fileLoader(__dirname +'/www/dream.html')

let sql1 = 'SELECT * FROM dream';
let sql2 = `SELECT * FROM dream WHERE rowid IN (SELECT rowid FROM dream ORDER BY RANDOM() LIMIT 1)`


// Create application/x-www-form-urlencoded parser
let urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static('www'));
app.listen(3000, () => console.log('Listening on 3000!'))

// Default page
app.get('/', function (req, res) {
    res.sendFile("index.html");
});

// Sending a dream
app.post('/', urlencodedParser, function (req, res) {
    console.log('Got a POST request');
    console.log(req.body);
    // Saving the dream
    add_to_db(req.body);
    // Sending the page with a new dream
    // each ?
    /*db.run(sql1,1, function(err, row) {
    if (err) {
      return console.log(err.message);
    }
    console.log(row);*/

    db.each("SELECT rowid AS id, name,tittle, text FROM dream WHERE rowid IN (SELECT rowid FROM dream ORDER BY RANDOM() LIMIT 1)", function(err, row) {
      console.log(row);
      console.log(row.id + ": " + row.name +" \n"+row.text);
      ejs.renderFile(__dirname +'/www/dream.html', row, function(err, str){
          console.log("str : "+str);
          res.end(str);
      });
  });

    /*ejs.renderFile(__dirname +'/www/dream.html', req.body, function(err, str){
        res.end(str);});*/
    //});
});


add_to_db({ name: 'Garance', tittle: 'Test', text: 'Test' });

function add_to_db(dream){
    let row = {
        $name : dream.name,
        $tittle : dream.titlle,
        $text : dream.text };
    db.run('INSERT INTO dream(name,tittle,text) VALUES ($name,$tittle,$text)',
     row, function(err) {
    if (err) {
      return console.log(err.message);
    }
    // get the last insert id_
    console.log(`A row has been inserted with rowid ${this.lastID}`);
  });
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
