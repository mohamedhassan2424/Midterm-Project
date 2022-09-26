// load .env data into process.env
require('dotenv').config();

// Web server config
const sassMiddleware = require('./lib/sass-middleware');
const express = require('express');
const morgan = require('morgan');
const cookieSession = require('cookie-session')
const bcrypt = require("bcryptjs");
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
  }
};
app.get('/', (req, res) => {
  res.render('index');
});

app.get("/login", (req,res)=>{
  res.render("loginPage")
})
app.post("/login", (req,res)=>{
  const { email, password } = req.body;
  const currentSession = req.session.userId
  const existsingUser=usersDatabase[currentSession]
  const user = getUserByEmail(email, usersDatabase);
  res.render("loginPage")
})
app.get("/register", (req,res)=>{
  const currentSession = req.session.userId
  const existsingUser=usersDatabase[currentSession]
  if(existsingUser){
    return res.send("YOUR ARE STILL LOGGED IN")
  }
  res.render("registrationPage")
})

app.post("/register", (req,res)=>{
  const generatedId = Math.random().toString(36).substring(2, 8);
  const { email, password } = req.body;
  const newhashedPassword = bcrypt.hashSync(password, 10)
  usersDatabase.id= {
    id:generatedId,
    email:email,
    password:newhashedPassword
  }
  req.session.userId=generatedId;
  console.log(usersDatabase)
  console.log(email)
  console.log(password)
  console.log(newhashedPassword)
  res.send("THANK YOU FOR LOGING.YOUR ARE KNOW AT THE MAIN PAGE")
})
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
