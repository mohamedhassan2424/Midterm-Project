// load .env data into process.env
require('dotenv').config();

// Web server config
const sassMiddleware = require('./lib/sass-middleware');
const express = require('express');
const morgan = require('morgan');
const cookieSession = require('cookie-session')
const bcrypt = require("bcryptjs");
const { getUserByEmail} = require("./helperFunction")
const PORT = process.env.PORT || 8080;
const app = express();

app.set('view engine', 'ejs');

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(
  '/styles',
  sassMiddleware({
    source: __dirname + '/styles',
    destination: __dirname + '/public/styles',
    isSass: false, // false => scss, true => sass
  })
);
app.use(express.static('public'));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const userApiRoutes = require('./routes/users-api');
const widgetApiRoutes = require('./routes/widgets-api');
const usersRoutes = require('./routes/users');
const { password } = require('pg/lib/defaults');

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// Note: Endpoints that return data (eg. JSON) usually start with `/api`
app.use('/api/users', userApiRoutes);
app.use('/api/widgets', widgetApiRoutes);
app.use('/users', usersRoutes);
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.use(
  cookieSession({
    name: "cookieName",
    keys: ["secretKey1", "secretKey2"],
  })
);
const usersDatabase = {
  userID: {
    id: "userID",
    email: "email@example.com",
    password: "user-typed-password",
    firstName: "First Name",
    lastName:"Last Name"
  }
};
app.get('/', (req, res) => {
  res.render('index');
});

app.get("/mainPage", (req,res)=>{
  const currentSession = req.session.userId
  const existsingUser=usersDatabase[currentSession]
  const templateVars ={user: existsingUser}
  res.render("mainPage",templateVars)
})
app.get("/login", (req,res)=>{
  const currentSession = req.session.userId
  const existsingUser=usersDatabase[currentSession]
  const templateVars ={user: existsingUser}
  console.log("existsingUser",existsingUser)
  if(existsingUser){
    return res.redirect('/mainPage')
  }
  res.render("loginPage",templateVars)
})
app.post("/login", (req,res)=>{
  const { email, password } = req.body;
  const currentSession = req.session.userId
  const existsingUser=usersDatabase[currentSession]
  const loggedInUser= getUserByEmail(email, usersDatabase);

  const comparingThePassword = bcrypt.compareSync(password, loggedInUser.password)
  console.log("comparingThePassword",comparingThePassword)
  if(!comparingThePassword){
    res.send('Invlaid Password, Please Try and re-enter your password again.')
  }
  if (comparingThePassword && loggedInUser) {
    req.session.userId = loggedInUser.id;
    return res.redirect("/mainPage");
  }
  //res.render("loginPage")
})

app.post("/logout", (req,res)=>{
  req.session = null
  res.redirect("/mainPage")
})
app.get("/register", (req,res)=>{
  const currentSession = req.session.userId
  console.log("Current Session", req.session.userId)
  const existsingUser=usersDatabase[currentSession]
  const templateVars ={user: existsingUser}
  console.log("existsingUser",existsingUser)
  if(existsingUser){
    return res.redirect("/mainPage")
  }
  res.render("registrationPage",templateVars)
})

app.get("/creatingQuiz", (req,res)=>{
  const currentSession = req.session.userId
  const existsingUser=usersDatabase[currentSession]
  const templateVars ={user: existsingUser}

  res.render("creatingQuizPage",templateVars)
})
app.get("/quizCreatedSuccesfully", (req,res)=>{
  const currentSession = req.session.userId
  const existsingUser=usersDatabase[currentSession]
  const templateVars ={user: existsingUser}
  res.render("quizCreatedSuccesfully",templateVars)
})
app.post("/register", (req,res)=>{
  const generatedId = Math.random().toString(36).substring(2, 8);
  const { email, password,firstName,lastName } = req.body;
  const newhashedPassword = bcrypt.hashSync(password, 10)
  if (email.length === 0) {
    return res.send("400 Status Code : Please type in an accepatable Email with substantial chracter length to continue with registering.");
  }
  if (password.length === 0) {
    return res.send("400 Status Code : Please type in an accepatable password with substantial chracter length  continue with registering");
  }
  if (firstName.length === 0) {
    return res.send("400 Status Code : Please type in an accepatable value for FIRST Name button with substantial chracter length  continue with registering");
  }
  if (lastName.length === 0) {
    return res.send("400 Status Code : Please type in an accepatable value for LAST Name button with substantial chracter length continue with registering");
  }
  if (getUserByEmail(email, usersDatabase)) {
    return res.send("Staus Code 400. Email type in already exist in the Database. Please type in a Different database");
  }
  usersDatabase[generatedId]= {
    id:generatedId,
    email:email,
    password:newhashedPassword,
    firstName:firstName,
    lastName:lastName
  }
  req.session.userId=generatedId;
  console.log(usersDatabase)
  console.log("REQ-session-Id",req.session.userId)
  //console.log(email)
  //console.log(password)
  //console.log(newhashedPassword)
  res.redirect("/mainPage")
})
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
