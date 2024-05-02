const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/users/login', userController.userLogin);

router.post('/users', userController.userSignup);

router.put('/users', userController.forgetPassword);

module.exports = router;