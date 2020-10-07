const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app = express();  // setup express

app.use(express.static(__dirname + "/public")); // setup directory where static files will be
app.use(bodyParser.json());   // setup body-parser
app.use(bodyParser.urlencoded({ extended: true })); // setup body-parser

app.set('view engine', 'ejs'); // setup ejs

/***** Setup mongooose *****/
const dbName = "todos";
mongoose.connect("mongodb://localhost/" + dbName, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("Connected to database " + dbName + ".");
});

/***** Setup DB Model *****/
const todoSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true
  },
  todos: {
    type: [String],
    required: true
  }
});


const port = 3000;

app.get("/", function(req, res){
  res.render("home");
});

app.post("/toDosCategory", function(req, res){
  // console.log(req.body.toDosCategory); // accurately logs

});

app.listen(port, function(){
  console.log("Server started listening on port " + port);
});
