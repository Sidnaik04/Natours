const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync.js');
const factory = require('./handlerFactory.js');

// middleware -> run before create review
exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

// factory function for create review
exports.createReview = factory.createOne(Review);

// factory function for delete review
exports.deleteReview = factory.deleteOne(Review);

// factory function for delete review
exports.updateReview = factory.updateOne(Review);

// Factory function to get one review
exports.getReview = factory.getOne(Review);

// Factory function to get all reviews
exports.getAllReviews = factory.getAll(Review);
