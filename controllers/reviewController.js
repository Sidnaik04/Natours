const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync.js');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  // get endpoint for nested route
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };

  // fetch review from database
  const review = await Review.find(filter);

  res.status(200).json({
    status: 'Success',
    results: review.length,
    data: {
      review,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: 'Success',
    data: {
      review: newReview,
    },
  });
});
