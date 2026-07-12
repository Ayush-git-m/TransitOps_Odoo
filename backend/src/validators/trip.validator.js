const validateCreateTrip = (req, res, next) => {

    const {
        vehicle_id,
        driver_id,
        source,
        destination,
        cargo_weight,
        planned_distance
    } = req.body;

    if (
        !vehicle_id ||
        !driver_id ||
        !source ||
        !destination
    ) {

        return res.status(400).json({
            success: false,
            message: "All required fields are mandatory"
        });

    }

    if (source === destination) {

        return res.status(400).json({
            success: false,
            message: "Source and Destination cannot be same"
        });

    }

    if (cargo_weight < 0) {

        return res.status(400).json({
            success: false,
            message: "Invalid Cargo Weight"
        });

    }

    if (planned_distance <= 0) {

        return res.status(400).json({
            success: false,
            message: "Invalid Planned Distance"
        });

    }

    next();

};

module.exports = {
    validateCreateTrip
};
