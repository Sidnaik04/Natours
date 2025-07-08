const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authControllers = require('.././controllers/authControllers');

const router = express.Router({ mergeParams: true });

// /tour/tourId/reviews or /reviews => both will call same route due to use of mergeParams

router.route('/').get(reviewController.getAllReviews).post(
  authControllers.protect,
  authControllers.restrictTo('user'), //only authenticated users should be allowed to review
  reviewController.createReview
);

module.exports = router;
