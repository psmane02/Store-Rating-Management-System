const express = require("express");

const {
    submitRating,
    getUserRating,
    getStoreRatings
} = require("../controllers/ratingController");

const {
    authenticate,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================================
// USER - SUBMIT / MODIFY RATING
// =====================================================

router.put(
    "/:storeId",
    authenticate,
    authorize("USER"),
    submitRating
);


// =====================================================
// USER - GET OWN RATING
// =====================================================

router.get(
    "/:storeId/my-rating",
    authenticate,
    authorize("USER"),
    getUserRating
);


// =====================================================
// OWNER - GET STORE RATINGS
// =====================================================

router.get(
    "/:storeId",
    authenticate,
    authorize("OWNER"),
    getStoreRatings
);


module.exports = router;