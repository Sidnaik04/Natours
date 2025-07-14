const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const path = require('path');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorControllers');

const app = express();

app.set('view engine', 'pug');

// pug engine
app.set('views', path.join((__dirname, 'views')));

// Serving static files
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));

// GLOBAL MIDDLEWARE
// Set security HTTP Header
app.use(helmet());

// Development Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); //inbuilt middleware
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100, //max 100 request from same IP
  windowMs: 60 * 60 * 1000, //for 1 hr
  message: 'Too many request from this IP, Please try again after 1 hour!',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' })); //inbuilt middleware

// Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

// Prevent Parameter Pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'maxGroupSize',
      'price',
      'difficulty',
      'ratingsAverage',
      'ratingQuantity',
    ],
  })
);

/*app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
});*/

// Test Middleware
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

//MAIN ROUTES => mouting
app.use('/api/v1/tours', tourRouter); //mounting routers
app.use('/api/v1/users', userRouter); //mounting routers
app.use('/api/v1/reviews', reviewRouter); //mounting routers
app.use('/', viewRouter);

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
