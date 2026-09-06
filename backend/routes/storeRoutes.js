const express = require("express");

const {
    getStores,
    ownerDashboard
} = require("../controllers/storeController");

const {
    authenticate,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================================
// NORMAL USER - VIEW ALL STORES
// =====================================================

router.get(
    "/",
    authenticate,
    authorize("USER"),
    getStores
);


// =====================================================
// STORE OWNER - OWNER DASHBOARD
// =====================================================

router.get(
    "/owner-dashboard",
    authenticate,
    authorize("OWNER"),
    ownerDashboard
);


module.exports = router;