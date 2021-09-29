const express = require('express');
const morgan = require('morgan');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const app = express();
const PORT = 8080;

//  MIDDLEWARE
app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())

//  DATABASES
const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};

// HELPER FUNCTIONS
const generateRandomString = function () {
  return Math.floor((1 + Math.random()) * 0x1000000).toString(16).substring(1);
};

//_.~"(_.~"(_.~"(_.~"(_.~"(_.~"(_.~"(_.~"(_.~"(_.~"(

// HOME
// INITIATE /URLS <==> urls_index.ejs
app.get('/urls', (req, res) => {
  // console.log(urlDatabase);
  // console.log(urlDatabase.b2xVn2);
  // console.log(urlDatabase['b2xVn2']);
  const username = req.cookies.username
  const templateVars = { urls: urlDatabase, username };
  res.render("urls_index", templateVars);
});

//NEW
//INITIATE NEW URLs <==> urls_new.ejs
app.get('/urls/new', (req, res) => {
  const username = req.cookies.username
  const templateVars = { username };
  res.render('urls_new', templateVars);
});

// CREATE NEW TINY URL - REDIRECT /urls_new <==> /urls
app.post("/urls", (req, res) => {
  // console.log(req.body);
  const longURL = req.body.longURL;
  const shortURL = generateRandomString(longURL);
  urlDatabase[shortURL] = longURL;
  // console.log(urlDatabase);
  res.redirect(`/urls/${shortURL}`);
});

// REDIRECT TO LONG URL
app.get("/u/:shortURL", (req, res) => {
  // console.log(req.body);
  // console.log(req.params);
  const longURL = urlDatabase[req.params.shortURL];
  // console.log(longURL);
  res.redirect(longURL);
});

// DELETE SHORT URL
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect('/urls');
});

// EDIT URL
app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  // console.log(shortURL);
  const longURL = req.body.longURL;
  // console.log(longURL);
  urlDatabase[shortURL] = longURL;
  res.redirect("/urls");
});

//SHOW
//INITIATE SHORT URL TEMPLATE <==> urls_show.ejs
app.get("/urls/:shortURL", (req, res) => {
  const username = req.cookies.username
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username};
  // console.log(req.params);
  // console.log(req.params.shortURL);
  res.render("urls_show", templateVars);
});

// LOGIN
app.post('/login', (req, res) => {
  const username = req.body.username;
  res.cookie('username', username);
  res.redirect('/urls')
});

// LOGOUT 
// RENDER LOGOUT BUTTON IF USER
app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls')
})










// // DEFAULT // CATCH - ALL ERRORS
// app.get ('*', (req, res) => {
//   res.status(404).send('Error'); // unhappy path
// });

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

//_.~"(_.~"(_.~"(_.~"(_.~"(_.~"(_.~"(_.~"(_.~"(_.~"(
//   _.~"(_.~"(_.~"(_.~"(_.~"(_.~"(_.~"(_.~"(_.~"(_.~"(

app.listen(PORT, () => {
  console.log(`On PORT ${PORT}...`);
});