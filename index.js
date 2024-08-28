const express = require('express');
require('express-async-errors');
const app = express();

const { PORT } = require('./util/config');
const { connectToDatabase } = require('./util/db');

const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const authorsRouter = require('./controllers/authors');
const readingListRouter = require('./controllers/readinglists');

app.use(express.json());

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/authors', authorsRouter);
app.use('/api/readinglists', readingListRouter);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'SequelizeValidationError') {
    return response.status(400).send({ error: 'bad request validation:\n' + error.message });
  } else if (error.name === 'SequelizeDatabaseError') {
    return response.status(400).send({ error: 'bad request data: ' + error.message })
  }

  next(error);
};

app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
  });
};

start();