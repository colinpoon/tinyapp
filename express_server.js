const express = require('express');
const morgan = require('morgan');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080;

//  MIDDLEWARE
app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


//  DATABASES
const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};

const users = {
  "a": {
    id: "a",
    email: "a@gmail.com",
    password: "123"
  },
  "b": {
    id: "b",
    email: "b@gmail.com",
    password: "123"
  }
};

// HELPER FUNCTIONS
const generateRandomString = function () {
  return Math.floor((1 + Math.random()) * 0x1000000).toString(16).substring(1);
};

const getUserByEmail = function (email) {
  for (const userID in users) {
    const user = users[userID];
    if (user.email === email) {
      return user;
    }
  }
  return null;
};

//_.~"(_.~"(_.~"(_.~"(_.~"(_.~"(_.~"(_.~"(_.~"(_.~"(
  

// HOME
// INITIATE /URLS <==> urls_index.ejs
app.get('/urls', (req, res) => {
  // console.log(urlDatabase);
  // console.log(urlDatabase.b2xVn2);
  // console.log(urlDatabase['b2xVn2']);
  const id = req.cookies.user_id;
  console.log(id);
  const user = users[id];
  const templateVars = { urls: urlDatabase, user};
  res.render("urls_index", templateVars);
});

//NEW
//INITIATE NEW URLs <==> urls_new.ejs
app.get('/urls/new', (req, res) => {
  const username = req.cookies.username;
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
  const username = req.cookies.username;
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username };
  // console.log(req.params);
  // console.log(req.params.shortURL);
  res.render("urls_show", templateVars);
});

// REGISTER
//INITIATE REGISTRATION
app.get('/register', (req, res) => {
  const user = null;
  const templateVars = { user };

  res.render('urls_register', templateVars);
});

app.post('/register', (req, res) => {
  const email = req.body.email;
  // console.log(email);
  const password = req.body.password;
  // console.log(password);
  //CHECK IF INPUT FIELDS ARE BLANK
  if (!email || !password) {
    return res.status(400).send("400: Email and password cannot be left blank.");
  };

  // IS EMAIL IN USERS DATABASE
  // const user = getUserByEmail(email);
  if (getUserByEmail(email)) {
    return res.status(400).send('400: User already exists.');
  };
  // ADD USER TO DATABASE
  const id = Math.floor((1 + Math.random()) * 0x1000000).toString(16).substring(1);

  users[id] = { id, email, password };

  res.cookie("user_id", id);
  console.log("USER[ID] for new user >>------->>>", users[id]);
  console.log(users);

  res.redirect('/urls');
});

// LOGIN
app.get('/login', (req, res) => {
  const user = null;
  const templateVars = { user };
  res.render('urls_login', templateVars);
});

app.post('/login', (req, res) => {

  const email = req.body.email;
  const user = getUserByEmail(email);

  res.cookie('user_id', user.id);
  res.redirect('/urls');
});

// LOGOUT
// RENDER LOGOUT BUTTON IF USER
app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/login');
});

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