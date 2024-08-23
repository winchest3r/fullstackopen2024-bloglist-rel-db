const express = require('express');
require('express-async-errors');
const app = express();

const { PORT } = require('./util/config');
const { connectToDatabase } = require('./util/db');

const blogsRouter = require('./controllers/blogs');

app.use(express.json());

app.use('/api/blogs', blogsRouter);

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