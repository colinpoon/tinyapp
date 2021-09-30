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

const urlsForUser = function(id) {

};

//_.~"(_.~"(_.~"(_.~"(_.~"(_.~"(_.~"(_.~"(_.~"(_.~"(
  

// HOME
// INITIATE /URLS <==> urls_index.ejs
app.get('/urls', (req, res) => {
  const userID = req.cookies.user_id;
  if (!userID) {
    res.status(403).send("Must be logged in to view");
    return;
  }
  const user = users[id];
  const templateVars = { user };
  res.render("urls_index", templateVars);
});



app.get("/", (req, res) => {
  const user = req.cookies.user_id;
  if (!user) {
    res.redirect("/login");
    return;
  }
  res.redirect("/urls");
});

//NEW
//INITIATE NEW URLs <==> urls_new.ejs ******
app.get('/urls/new', (req, res) => {
  const id = req.cookies.user_id;
  if (!id) {
    res.redirect("/login");
    return;
  }
  const user = users[id];
  const templateVars = { user };
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
  const id = req.cookies.user_id;
  const user = users[id];
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user };
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
    return res.status(400).send("Invalid Registration: Email or password cannot be left blank.");
  };

  // IS EMAIL IN USERS DATABASE
  // const user = getUserByEmail(email);
  if (getUserByEmail(email)) {
    return res.status(400).send('Error: User already exists.');
  };
  // ADD USER TO DATABASE
  const id = Math.floor((1 + Math.random()) * 0x1000000).toString(16).substring(1);
  users[id] = { id, email, password };
  res.cookie("user_id", id);
  console.log("USER[ID] for new user >>------->>>", users[id]);
  // console.log(users);

  res.redirect('/urls');
});

// LOGIN
app.get('/login', (req, res) => {
  const id = req.cookies.user_id;
  if (id) {
    res.redirect("/urls");
    return;
  }
  let user = null;
  for (const key in users) {
    if (key === id) {
      user = users[key];
    }
  }
  const templateVars = { user };
  res.render('urls_login', templateVars);
});










//LOGIN
//USER PATH ------------------------------------------- Looking to see if user password matches password input.
app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    res.status(400).send("Invalid Login: Email or password cannot be left blank")
    return;
  }
  const user = getUserByEmail(email);
  if(!user){
    res.status(403).send("Error: User doesn't exist");
  }
  if (user.email !== email || user.password !== password){
    return res.status(403).send("Invalid login");
  }
  // console.log(user.password);
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