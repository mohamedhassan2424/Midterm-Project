DROP TABLE IF EXISTS quizzes CASCADE;
CREATE TABLE quizzes (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  quiz_title VARCHAR(255) NOT NULL,
  categories VARCHAR(255) NOT NULL,
  questionValue INTEGER ,
  question VARCHAR(255) ,
  first_answer VARCHAR(255) ,
  second_answer VARCHAR(255) ,
  third_answer VARCHAR(255) ,
  fourth_answer VARCHAR(255) 
);

