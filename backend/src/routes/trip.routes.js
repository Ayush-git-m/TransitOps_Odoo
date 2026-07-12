const express = require("express");

const router = express.Router();

const auth = require("../middlewares/auth.middleware");

const authorize = require("../middlewares/role.middleware");

const tripController = require("../controllers/trip.controller");


const {
    validateCreateTrip
} = require("../validators/trip.validator");


router.post(
    "/",
    auth,
    authorize("DISPATCHER", "FLEET_MANAGER"),
    validateCreateTrip,
    tripController.createTrip
);

router.get(
    "/",
    auth,
    tripController.getAllTrips
);

router.get(
    "/:id",
    auth,
    tripController.getTripById
);

router.patch(
    "/:id/dispatch",
    auth,
    authorize("DISPATCHER"),
    tripController.dispatchTrip
);

router.patch(
    "/:id/complete",
    auth,
    authorize("DISPATCHER"),
    tripController.completeTrip
);

router.patch(
    "/:id/cancel",
    auth,
    authorize("FLEET_MANAGER"),
    tripController.cancelTrip
);

module.exports = router;
