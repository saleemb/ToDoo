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
mongoose.connect("mongodb://localhost/" + dbName, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

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
    type: [String]
  }
});
const ToDo = mongoose.model("ToDo", todoSchema);


/***** Setup request handlers ******/
const port = 3000;

app.get("/", function(req, res){
  ToDo.find(function(err, todos){
    if (err) return console.error(err);

    console.log(todos);

    res.render("home", { todos: todos });

    // ejs.renderFile(__dirname + "/views/home", { todos: todos }, function(err, str){
    //   if (err) {
    //     console.log(err);
    //   }
    // });
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
      res.redirect("/");
    }
  });
});

app.listen(port, function(){
  console.log("Server started listening on port " + port);
});
