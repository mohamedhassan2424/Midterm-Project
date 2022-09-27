// load .env data into process.env
require("dotenv").config();
const { Pool } = require('pg');
// Web server config
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const morgan = require("morgan");
const cookieSession = require("cookie-session");
const bcrypt = require("bcryptjs");
const { getUserByEmail } = require("./helperFunction");
const PORT = process.env.PORT || 8080;
const app = express();
const $ = require( "jquery" )
app.set("view engine", "ejs");
const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'midterm'
});
// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);
app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const userApiRoutes = require("./routes/users-api");
const widgetApiRoutes = require("./routes/widgets-api");
const usersRoutes = require("./routes/users");
const { password } = require("pg/lib/defaults");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// Note: Endpoints that return data (eg. JSON) usually start with `/api`
app.use("/api/users", userApiRoutes);
app.use("/api/widgets", widgetApiRoutes);
app.use("/users", usersRoutes);
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
    lastName: "Last Name",
  },
};

const questionText = {
  userID: {
    id: "UserId",
    firstQuestion: "Question Text",
    answerOne: "Possible answer one",
    answerTwo: "Possible answer one",
    answerThree: "Possible answer one",
    answerFour: "Possible answer one",
  },
};

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/main-page", (req, res) => {
  const currentSession = req.session.userId;
  pool.query(`SELECT * FROM users
  WHERE users.id= $1;`,[currentSession])
  .then((response)=>{
    const userData = response.rows[0]
    const templateVars = { user: userData};
    res.render("main-page", templateVars);
  }).catch((error)=>{
    console.log("Their is an error", error.message)
    })
  //const existsingUser = usersDatabase[currentSession];
  //const templateVars = { user: existsingUser };
  //res.render("main-page", templateVars);
});

app.get("/login", (req, res) => {
  const currentSession = req.session.userId;
  //const existsingUser = usersDatabase[currentSession];
  //const templateVars = { user: existsingUser };
  pool.query(`SELECT * FROM users
  WHERE users.id= $1;`,[currentSession])
  .then((response)=>{
    const userData = response.rows[0]
    const templateVars = { user: userData};
    if (userData) {
      return res.redirect("/main-page");
    }
    res.render("login-page", templateVars);
  })
  .catch((error)=>{
    console.log("Their is an error", error.message)
    })
  /*if (existsingUser) {
    return res.redirect("/main-page");
  }
  res.render("login-page", templateVars);*/
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const currentSession = req.session.userId;
  /*
  const existsingUser = usersDatabase[currentSession];
  const loggedInUser = getUserByEmail(email, usersDatabase);
  const comparingThePassword = bcrypt.compareSync(
    password,
    loggedInUser.password
  );*/
pool.query(`SELECT id ,email,password,firstname,lastname FROM users
WHERE email = $1;`,[email])
.then((response)=>{
  const loggedInEmail = response.rows[0]
  const passwordObj = loggedInEmail.password
  const comparingThePassword = bcrypt.compareSync(
    password,
    passwordObj
  );
console.log("ComparingThePassword",comparingThePassword)
if (!comparingThePassword) {
  res.send("Invlaid Password, Please Try and re-enter your password again.");
}
if (comparingThePassword) {
  req.session.userId = response.rows[0].id ;
  return res.redirect("/main-page");
}
})
.catch((error)=>{
console.log("Their is an error", error.message)
})
 
  //console.log("comparingThePassword", comparingThePassword);
 /* if (!comparingThePassword) {
    res.send("Invlaid Password, Please Try and re-enter your password again.");
  }
  if (comparingThePassword && loggedInUser) {
    req.session.userId = loggedInUser.id;
    return res.redirect("/main-page");
  }*/
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/main-page");
});

app.get("/register", (req, res) => {
  const currentSession = req.session.userId;
  console.log("WORKING HERE")
  //console.log("Current Session", req.session.userId);
  //const existsingUser = usersDatabase[currentSession];
  //const templateVars = { user: existsingUser };
  //console.log("existsingUser", existsingUser);
  pool.query(`SELECT * FROM users
  WHERE users.id= $1;`,[currentSession])
  .then((response)=>{
    const userData = response.rows[0]
    const templateVars = { user: userData};
    if (userData) {
      return res.redirect("/main-page");
    }
  res.render("registration-page", templateVars);
  }).catch((error)=>{
    console.log("Their is an error", error.message)
    })
});

app.get("/creating-quiz-page", (req, res) => {
  const currentSession = req.session.userId;
  //const existsingUser = usersDatabase[currentSession];
  //const templateVars = { user: existsingUser };

  pool.query(`SELECT * FROM users
  WHERE users.id= $1;`,[currentSession])
  .then((response)=>{
    const userData = response.rows[0]
    const templateVars = { user: userData};
    res.render("creating-quiz-page", templateVars);
  }).catch((error)=>{
    console.log("Their is an error", error.message)
    })
    
  //res.render("creating-quiz-page", templateVars);
});

app.post("/creating-quiz-page", (req, res) => {
  const currentSession = req.session.userId;
  //const existsingUser = usersDatabase[currentSession];
  const {quiz_title, question, firstAnswer, secondAnswer, thirdAnswer, fourthAnswer } =
    req.body;
  //console.log("QUESITONNNN", question);
  const insertingQuestionProperties = (quiz_title,userid, question, firstAnswer, secondAnswer, thirdAnswer, fourthAnswer )=>{
    return pool
    .query(`INSERT INTO quizzes (quiz_title,user_id,question, first_answer, second_answer, third_answer, fourth_answer )
    VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *;`,[quiz_title,userid, question, firstAnswer, secondAnswer, thirdAnswer, fourthAnswer ])
    .then((response)=>{
      
    console.log("DATA VALUES",response.rows[0])
    const dataProperties = response.rows[0]
    pool.query(`SELECT * FROM users
    WHERE users.id= $1;`,[currentSession])
    .then((response)=>{
    const userData = response.rows[0]
    //const templateVars = { user: userData,questionObject:dataProperties};
    res.redirect("/quiz-created");
  })
    }).catch((error)=>{
    console.log("THEIR IS AN ERROR",error.message)
    })
    }
    insertingQuestionProperties(quiz_title,currentSession,question, firstAnswer, secondAnswer, thirdAnswer, fourthAnswer)
  /*const generatedId = Math.random().toString(36).substring(2, 8);
  questionText[generatedId] = {
    id: generatedId,
    firstQuestion: question,
    answerOne: firstAnswer,
    answerTwo: secondAnswer,
    answerThree: thirdAnswer,
    answerFour: fourthAnswer,
  };*/
  //console.log("QuestionText", questionText);
  /*const templateVars = {
    user: existsingUser,
    questionObject: questionText[generatedId],
  };
  res.render("quiz-created", templateVars);*/
});

app.get("/quiz-created", (req,res)=>{
  const currentSession = req.session.userId
  console.log("CURRENT SESSION", currentSession)
  pool.query(`SELECT * FROM quizzes
  JOIN users ON user_id=users.id
  WHERE user_id = $1;`,[currentSession])
  .then((response)=>{
  const usersQuiz= response.rows;
  console.log("DATA PROPERTIES",usersQuiz )
  pool.query(`SELECT * FROM users
  WHERE users.id = $1;`,[currentSession])
  .then((response)=>{
    const userData = response.rows[0]
    const templateVars = { user: userData,usersQuiz}
    res.render("quiz-created",templateVars)
  })
  })
  .catch((error)=>{
    console.log("THEIR IS AN ERROR",error.message)
    })
});

app.post("/register", (req, res) => {
  const generatedId = Math.random().toString(36).substring(2, 8);
  const { email, password, firstName, lastName } = req.body;
  const newhashedPassword = bcrypt.hashSync(password, 10);
  if (email.length === 0) {
    return res.send(
      "400 Status Code : Please type in an accepatable Email with substantial chracter length to continue with registering."
    );
  }
  if (password.length === 0) {
    return res.send(
      "400 Status Code : Please type in an accepatable password with substantial chracter length  continue with registering"
    );
  }
  if (firstName.length === 0) {
    return res.send(
      "400 Status Code : Please type in an accepatable value for FIRST Name button with substantial chracter length  continue with registering"
    );
  }
  if (lastName.length === 0) {
    return res.send(
      "400 Status Code : Please type in an accepatable value for LAST Name button with substantial chracter length continue with registering"
    );
  }
  if (getUserByEmail(email, usersDatabase)) {
    return res.send(
      "Staus Code 400. Email type in already exist in the Database. Please type in a Different database"
    );
  }
  usersDatabase[generatedId] = {
    id: generatedId,
    email: email,
    password: newhashedPassword,
    firstName: firstName,
    lastName: lastName,
  };
  
const insertingProperties = ( firstName, lastName,email, password)=>{
return pool
.query(`INSERT INTO users (firstname,lastname,email,password)
VALUES ($1,$2,$3,$4) RETURNING *;`,[firstName, lastName,email, password])
.then((data)=>{
console.log("DATA VALUES",data.rows)
req.session.userId = data.rows[0].id
res.redirect("/main-page"); 
}).catch((error)=>{
console.log("THEIR IS AN ERROR",error.message)
})
}
insertingProperties(firstName, lastName,email, newhashedPassword);
  //console.log(email)
  //console.log(password)
  //console.log(newhashedPassword)
  
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
