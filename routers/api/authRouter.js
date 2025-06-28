const express = require('express');
const router = express.Router();
 const authController = require('../../controllers/authcController');
router.post('/signup',authController.signup);
router.post('/signin',authController.signin);
router.post('/signout',authController.signout);
router.patch('/sendverifycode',authController.sendVerificationCode);
router.patch('/verifyingCode',authController.verifyVerificationCode);

module.exports = router;