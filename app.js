const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorControllers');

const app = express();

// MIDDLEWARE
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); //inbuilt middleware
}

app.use(express.json()); //inbuilt middleware
app.use(express.static(`${__dirname}/public`));

/*app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
});*/

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

/*
app.get('/', (req, res) => {
  res
    .status(200)
    .json({ message: 'Hello from the server side', app: 'Natours' });
});

app.post('/', (req, res) => {
  res.send('You can post on this endpoint...');
});
*/

//ROUTES

app.use('/api/v1/tours', tourRouter); //mounting routers
app.use('/api/v1/users', userRouter); //mounting routers

// to handle unhandled routes
app.all('*', (req, res, next) => {
  /* res.status(404).json({
    status: 'fail',
    message: `Cant't find ${req.originalUrl} on this server!`,
  });
  */
  next(new AppError(`Cant't find ${req.originalUrl} on this server!`, 404));
});

// global middleware for error handling
app.use(globalErrorHandler);

module.exports = app;
