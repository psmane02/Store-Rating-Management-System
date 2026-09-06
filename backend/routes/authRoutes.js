const express = require("express");

const {
    signup,
    login,
    changePassword,
    getMe
} = require("../controllers/authController");

const {
    authenticate
} = require("../middleware/authMiddleware");

const router = express.Router();


// Signup
router.post(
    "/signup",
    signup
);


// Login
router.post(
    "/login",
    login
);


// Change Password
router.put(
    "/change-password",
    authenticate,
    changePassword
);


// Current User
router.get(
    "/me",
    authenticate,
    getMe
);


module.exports = router;