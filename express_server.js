const express = require('express');
const morgan = require('morgan');
const app = express();
const PORT = 8080;

//  MIDDLEWARE
app.set("view engine", "ejs");
app.use(morgan('dev'));

//  DATABASES
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//  GET HOME
app.get("/home", (req, res) => { // (request, response)
  res.send("Hello!");
});

app.get('/hello', (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

//  GET URLDATABASE IN JSON
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// // DEFAULT // CATCH - ALL
// app.get ('*', (req, res) => {
//   res.status(404).send('Error'); // unhappy path
// });

//_.~"(_.~"(_.~"(_.~"(_.~"(_.~"(_.~"(_.~"(_.~"(_.~"(
//   _.~"(_.~"(_.~"(_.~"(_.~"(_.~"(_.~"(_.~"(_.~"(_.~"(
app.listen(PORT, () => {
  console.log(`On PORT ${PORT}...`);
});