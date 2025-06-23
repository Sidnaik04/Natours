const AppError = require('./../utils/AppError');

// for invalid id
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}:${err.value}.`;
  return new AppError(message, 400);
};

// for duplicate fields
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];

  const message = `Duplicate field value: ${value}. Please use another value`;

  return new AppError(message, 400);
};

//for error validation
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// JWT Verification Token Error
const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

// JWT Token Expired Error
const handleJWTExpired = () =>
  new AppError('Your token has expired. Please log in again!', 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  //Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  // Programming or other unknown error: don't leak error details
  else {
    // 1) LOG error
    console.log('Error 💥', err);

    // 2) send generic mssg
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong !',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fail';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.create(err);

    if (error.name === 'CastError') error = handleCastErrorDB(error); //if error is CastError handle the error -> invalid id
    if (error.code === 11000) error = handleDuplicateFieldsDB(error); // handle the error for duplicate fields
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error); // validation of errors
    if (error.name === 'JsonWebTokenError') error = handleJWTError(); //handle jwt token verification error
    if (error.name === 'TokenExpiredError') error = handleJWTExpired(); //handle jwt token expired error

    sendErrorProd(error, res);
  }
};
