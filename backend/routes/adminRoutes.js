const express = require("express");

const {
    getDashboard,
    getUsers,
    createUser,
    getUserDetails,
    getStores,
    createStore
} = require("../controllers/adminController");

const {
    authenticate,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();


// All routes require ADMIN role
router.use(
    authenticate,
    authorize("ADMIN")
);


// Dashboard
router.get(
    "/dashboard",
    getDashboard
);


// Users
router.get(
    "/users",
    getUsers
);


// Create User
router.post(
    "/users",
    createUser
);


// User Details
router.get(
    "/users/:id",
    getUserDetails
);


// Stores
router.get(
    "/stores",
    getStores
);


// Create Store
router.post(
    "/stores",
    createStore
);


module.exports = router;