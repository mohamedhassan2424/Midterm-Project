DROP TABLE IF EXISTS quizzes CASCADE;
CREATE TABLE quizzes (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  quizzes_template_id INTEGER REFERENCES quizzes_template(id) ON DELETE CASCADE,
  question VARCHAR(255) NOT NULL,
  first_answer VARCHAR(255) NOT NULL,
  second_answer VARCHAR(255) NOT NULL,
  third_answer VARCHAR(255) NOT NULL,
  fourth_answer VARCHAR(255) NOT NULL
);

SELECT * FROM users
JOIN quizzes_template ON user_idqt=users.id
WHERE users.id =3 AND quizzes_template.id=10