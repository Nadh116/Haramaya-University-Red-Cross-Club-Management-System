const express = require('express');
const {
    register,
    login,
    getMe,
    updateDetails,
    updatePassword,
    forgotPassword,
    logout
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');
const {
    validateUserRegistration,
    validateUserLogin,
    handleValidationErrors
} = require('../middleware/validation');

const router = express.Router();

router.post('/register', validateUserRegistration, handleValidationErrors, register);
router.post('/login', validateUserLogin, handleValidationErrors, login);
router.get('/logout', logout);
router.post('/forgotpassword', forgotPassword);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);

module.exports = router;