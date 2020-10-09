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
mongoose.connect("mongodb://localhost/" + dbName, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false});

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
    required: true,
    unique: true
  },
  todos: {
    type: [{
      type: String
    }]
  }
});
const ToDo = mongoose.model("ToDo", todoSchema);

const homePageCategory = "All";

/***** Setup request handlers ******/
const port = 3000;

app.get("/", function(req, res){
  ToDo.find(function(err, todos){
    if (err) return console.error(err);
    res.render("home", { todos: todos, currentCategory: homePageCategory });
  });

});

// save category of todos to database
// (initially will not have any to dos associated with it)
app.post("/toDosCategory", function(req, res){
  const toDosCategory = new ToDo({ category: req.body.toDosCategory});
  toDosCategory.save(function(err, toDosCategory){
    if (err) {
      return console.error(err);
    } else {
      console.log("Added todos category " + toDosCategory.category + " to the database");
      res.redirect("/");  // TODO: fix so it goes to saved category instead
    }
  });
});


app.get("/:category/toDos", function(req, res){
  ToDo.find(function(err, todos){
    if (err) return console.error(err);
    res.render("home", { todos: todos, currentCategory: req.params.category });

  });
});

// save todo in its appropriate category
app.post("/:category/toDos", async function(req, res){
  console.log("Category: " + req.params.category + " Todo: " + req.body.toDo);
  const doc = await ToDo.findOneAndUpdate( { category: req.params.category },
                                     { $push: { todos: req.body.toDo } },
                                     { new: true });
});

app.listen(port, function(){
  console.log("Server started listening on port " + port);
});
