const express = require("express");
let ejs = require('ejs');

const app = express();

app.set('view engine', 'ejs');

const port = 3000;

app.get("/", function(req, res){
  res.render("home");
});

app.listen(port, function(){
  console.log("Server started listening on port " + port);
});
