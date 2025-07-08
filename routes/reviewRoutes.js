const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authControllers = require('.././controllers/authControllers');

// /tour/tourId/reviews or /reviews => both will call same route due to use of mergeParams
const router = express.Router({ mergeParams: true });

// middleware - to protect all routes after this middleware
router.use(authControllers.protect);

router.route('/').get(reviewController.getAllReviews).post(
  authControllers.restrictTo('user'), //only authenticated users should be allowed to review
  reviewController.setTourUserIds,
  reviewController.createReview
);

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authControllers.restrictTo('user', 'admin'),
    reviewController.updateReview
  )
  .delete(
    authControllers.restrictTo('user', 'admin'),
    reviewController.deleteReview
  );

module.exports = router;
