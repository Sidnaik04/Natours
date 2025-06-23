class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // message from parent class

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'; // if statuscode startswith 4 than fail or else error
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
