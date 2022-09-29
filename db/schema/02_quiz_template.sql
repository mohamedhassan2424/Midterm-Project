DROP TABLE IF EXISTS quizzes_template CASCADE;
CREATE TABLE quizzes_template (
  id SERIAL PRIMARY KEY NOT NULL,
  user_idqt INTEGER REFERENCES users(id) ON DELETE CASCADE,
  quiz_title VARCHAR(255) NOT NULL,
  categories VARCHAR(255) NOT NULL,
  questionValue INTEGER NOT NULL
);
