var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('dream.db');


db.run('CREATE TABLE dream(name,tittle,text)',function(err) {
if (err) {
  return console.log(err.message);
}});
