const express = require('express');
const tourController = require('../controllers/tourControllers');
const authControllers = require('.././controllers/authControllers');
const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();

// Nested routes => tour/id/reviews
router.use('/:tourId/reviews', reviewRouter);

// router.param('id', tourController.checkId);

// alias route for top 5 cheap tours
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

// aggregation route
router.route('/tour-stats').get(tourController.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authControllers.protect,
    authControllers.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
  );

// tour withing certain radius
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);
// or -> /tours-within?distance=42&center=-40,45&unit=mi -> this we do usually
//  /tours-within/42/center/-40,45/unit/mi -> this we will use now

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authControllers.protect,
    authControllers.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authControllers.protect,
    authControllers.restrictTo('admin', 'lead-guide'),
    tourController.updateTour
  )
  .delete(
    authControllers.protect,
    authControllers.restrictTo('admin', 'lead-guide'), //only admin can access this route
    tourController.deleteTour
  );

module.exports = router;
