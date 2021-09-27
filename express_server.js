const express = require('express');
const morgan = require('morgan');
const app = express();
const PORT = 8080;

//  MIDDLEWARE
app.set('view engine', 'ejs');
app.use(morgan('dev'));

//  DATABASES
const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};

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

//INITIATE SHORT URL <==> urls_show.ejs
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
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