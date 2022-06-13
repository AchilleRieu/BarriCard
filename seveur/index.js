// lien tuto : https://www.youtube.com/watch?v=T8mqZZ0r-RA

const express = require("express");
const app = express();
const mysql = require("mysql");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "barricarddatabase",
});

db.getConnection(function (error) {
  if (error) {
    throw error;
  } else {
    console.log("Connection establish");
  }
});

app.get("/", (req, res) => {
  const sqlInsert =
    "INSERT INTO connected_users (username, address) VALUES ('Bob','0001');";
  db.query(sqlInsert, (err, result) => {
    res.send("hello Achille !");
  });
});

app.listen(3001, () => {
  console.log("Running on port 3001");
});
