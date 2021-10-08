const express = require('express');
const morgan = require('morgan');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const { generateRandomString, getUserByEmail } = require('./helpers');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 8080;

//  MIDDLEWARE
app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));


//  DATABASES
const urlDatabase = {
  b6UTxQ: { // shortURL
    longURL: "https://www.tsn.ca",
    userID: "a"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "a"
  }
};

const users = {
  "a": {
    id: "a",
    email: "a@gmail.com",
    password: "$2b$10$yMf2F18S7T0RuOjKDhkrXeUGVbndJnqdIfO0AgR/E7xNZnweEjrJG"
  },
  "b": {
    id: "b",
    email: "b@gmail.com",
    password: "$2b$10$yMf2F18S7T0RuOjKDhkrXeUGVbndJnqdIfO0AgR/E7xNZnweEjrJG"
  }
};

const urlsForUser = function(id) {
  let output = {};
  for (const [key, value] of Object.entries(urlDatabase)) {
    if (id === value.userID) {
      output[key] = value.longURL;
    }
  }
  return output;
};
//_.~"(_.~"(_.~"(_.~"(_.~"(_.~"(_.~"(_.~"(_.~"(_.~"(

// HOME
app.get('/urls', (req, res) => {
  if (!req.session.user_id) {
    res.redirect("/login");
    return;
  };
  // STRETCH ATTEMPT
  let ts = Date.now();
  let dateObj = new Date(ts);
  let date = dateObj.getDate();
  let month = dateObj.getMonth() + 1;
  let year = dateObj.getFullYear();
  let postDate = (date + "." + month + "." + year);
  //
  const user = req.session.user_id;
  const templateVars = { urls: urlsForUser(user), user: users[user], postDate };
  res.render("urls_index", templateVars);
});
//  ROOT REDIRECT
app.get("/", (req, res) => {
  const userID = req.session.user_id;
  if (!userID) {
    res.redirect("/login");
    return;
  }
  res.redirect("/urls");
});

//NEW
//INITIATE NEW URLs
app.get('/urls/new', (req, res) => {
  const id = req.session.user_id;
  if (!id) {
    res.redirect("/login");
    return;
  }
  const user = users[id];
  const templateVars = { user };
  res.render('urls_new', templateVars);
});

// CREATE NEW TINY URL <-- USER POST
app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const userID = req.session.user_id;
  if (!userID) {
    res.redirect("/login");
    return;
  }
  const shortURL = generateRandomString(longURL);
  urlDatabase[shortURL] = { longURL: longURL, userID: userID };
  res.redirect(`/urls/${shortURL}`);
});

// REDIRECT LONG URL
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const urlData = urlDatabase[shortURL]
  const longURL = urlDatabase[shortURL];
  if (!longURL) { 
    res.status(404).send('URL not found')
  }
  res.redirect(longURL);
});

// DELETE SHORT URL
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  const id = req.session.user_id;
  const url = urlDatabase[shortURL];
  const user = users['id'];

  if (!user){
      return res.status(404).send('user does not exist, register first');
  }
  if (!url) {
    return res.status(404).send("This URL doesn't exist");
  }
  if (url.user_id !== id) {
    return res.status(404).send("You do not own this URL");
  }
  delete urlDatabase[shortURL];
  res.redirect('/urls');
});

// EDIT URL
app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  const id = req.session.user_id;
  const url = urlDatabase[shortURL];
  const user = users['id'];
  if (!user){
      return res.status(404).send('user does not exist, register first');
  }
  if (!url) {
    return res.status(404).send("This URL doesn't exist");
  }
  if (url.user_id !== id) {
    return res.status(404).send("You do not own this URL");
  }

  urlDatabase[shortURL].longURL = longURL;
  res.redirect("/urls");
});


//SHOW
//INITIATE SHORT URL TEMPLATE <
app.get("/urls/:shortURL", (req, res) => {
  // Stretch Attempt
  let ts = Date.now();
  let dateObj = new Date(ts);
  let date = dateObj.getDate();
  let month = dateObj.getMonth() + 1;
  let year = dateObj.getFullYear();
  let postDate = (date + "." + month + "." + year);
  ///// Seems to only save the date NOW and doesnt commit it to memmory. More research
  const id = req.session.user_id;
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  const url = urlDatabase[shortURL];
  if (!longURL) {
    return res.status(404).send('URL unavailable') ;
  }
  const user = users[id];
  const urlData = urlDatabase[shortURL];
  if (!urlsForUser(id).userID === id) {
    return res.send('You do not own this URL');
  }
  if (!id) {
    return res.send('Must be logged in');
  }
  if (!urlData) { 
    return res.status(400).send("URL Unavailable");
  }
  if (urlData.userID !== id) {
    return res.send('You do not own this URL');
  }
  const templateVars = { shortURL, longURL, user, postDate };
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
  let password = req.body.password
  //CHECK IF INPUT FIELDS ARE BLANK
  if (!email || !password) {
    return res.status(400).send("Invalid Registration: Email or password cannot be left blank.");
  }
  // IS EMAIL IN USERS DATABASE
  if (getUserByEmail(email, users)) {
    return res.status(400).send('Error: User already exists.');
  }
  // ADD USER TO DATABASE
  password = bcrypt.hashSync(req.body.password, 10);
  const id = generateRandomString();
  users[id] = { id, email, password };
  req.session.user_id = id;
  res.redirect('/urls');
});

// LOGIN
app.get('/login', (req, res) => {
  const id = req.session.user_id;
  if (id) {
    res.redirect("/urls");
    return;
  }
  let user = null;
  const templateVars = { user };
  res.render('urls_login', templateVars);
});

//LOGIN
//USER PATH
app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    res.status(400).send("Invalid Login");
    return;
  }
  const user = getUserByEmail(email, users);

  if (!user) {
    res.status(404).send("404 - Not Found");
  }
  if ((!bcrypt.compareSync(password, user.password))) {
    res.status(401).send("Invalid login");
    return;
  }
  req.session.user_id = user.id;
  res.redirect('/urls');
});

// LOGOUT
// RENDER LOGOUT BUTTON IF USER
app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/login');
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//_.~"(_.~"(_.~"(_.~"(_.~"(_.~"(_.~"(_.~"(_.~"(_.~"(
//   _.~"(_.~"(_.~"(_.~"(_.~"(_.~"(_.~"(_.~"(_.~"(_.~"(

app.listen(PORT, () => {
  console.log(`On PORT >>------> ${PORT}`);
});
