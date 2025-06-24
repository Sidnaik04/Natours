const express = require('express');
const userController = require('../controllers/userControllers');
const authController = require('./../controllers/authControllers');

const router = express.Router();

router.post('/signup', authController.signup); //route for user signup
router.post('/login', authController.login); //route for user login
router.post('/forgotPassword', authController.forgotPassword); //route for forgot password
router.patch('/resetPassword/:token', authController.resetPassword); //route for reset password

// to update current password
router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);

// to update current user data
router.patch('/updateMe', authController.protect, userController.updateMe);

// to delete current user
router.delete('/deleteMe', authController.protect, userController.deleteMe);

router
  .route('/')
  .get(userController.getAllUser)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
