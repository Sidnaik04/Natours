const express = require('express');
const tourController = require('../controllers/tourControllers');
const authControllers = require('.././controllers/authControllers');

const router = express.Router();

// router.param('id', tourController.checkId);

// alias route for top 5 cheap tours
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

// aggregation route
router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(authControllers.protect, tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authControllers.protect,
    authControllers.restrictTo('admin', 'lead-guide'), //only admin can access this route
    tourController.deleteTour
  );

module.exports = router;
