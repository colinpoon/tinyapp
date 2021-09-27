const express = require('express');
const morgan = require('morgan');
const bodyParser = require("body-parser");
const app = express();
const PORT = 8080;

//  MIDDLEWARE
app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));

//  DATABASES
const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};

// HELPER FUNCTIONS
// const generateRandomString = function (length = 6) {
//   return Math.random().toString(20).substr(2, length)
// };
function generateRandomString() {
  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 8);
  return;
};

//_.~"(_.~"(_.~"(_.~"(_.~"(_.~"(_.~"(_.~"(_.~"(_.~"(

//  GET /HOME <==> currently unused
app.get('/home', (req, res) => { // (request, response)
  res.send('Hello!');
});

//  GET URLDATABASE IN JSON
// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

// INITIATE /URLS <==> urls_index.ejs
app.get('/urls', (req, res) => {
  // console.log(urlDatabase);
  // console.log(urlDatabase.b2xVn2);
  // console.log(urlDatabase['b2xVn2']);
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

//INITIATE NEW URLs <==> urls_new.ejs
app.get('/urls/new', (req, res) => {
  res.render('urls_new')
});

// POST NEW LONG URL  <==> urls_new.ejs
app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

//INITIATE SHORT URL <==> urls_show.ejs
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  // console.log(req.params);
  // console.log(req.params.shortURL);
  res.render("urls_show", templateVars);
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