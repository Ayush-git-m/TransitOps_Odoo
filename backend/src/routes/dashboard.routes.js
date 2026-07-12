const express = require("express");

const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

const dashboardController = require("../controllers/dashboard.controller");

router.get(
    "/summary",
    auth,
    dashboardController.getSummary
);

router.get(
    "/recent-trips",
    auth,
    dashboardController.getRecentTrips
);

router.get(
    "/top-costly-vehicles",
    auth,
    authorize("FLEET_MANAGER", "FINANCIAL_ANALYST"),
    dashboardController.getTopCostlyVehicles
);

router.get(
    "/vehicle-status",
    auth,
    dashboardController.getVehicleStatus
);

router.get(
    "/analytics",
    auth,
    authorize("FINANCIAL_ANALYST", "FLEET_MANAGER"),
    dashboardController.getAnalytics
);


module.exports = router;
