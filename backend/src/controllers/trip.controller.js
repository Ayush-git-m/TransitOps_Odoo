const tripService = require("../services/trip.service");

const createTrip = async (req, res) => {

    try {

        const result = await tripService.createTrip(req.body);

        return res.status(201).json({
            success: true,
            message: "Trip Created Successfully",
            data: result
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }

};

const getAllTrips = async (req, res) => {};

const getTripById = async (req, res) => {};

const dispatchTrip = async (req, res) => {};

const completeTrip = async (req, res) => {};

const cancelTrip = async (req, res) => {};

module.exports = {
    createTrip,
    getAllTrips,
    getTripById,
    dispatchTrip,
    completeTrip,
    cancelTrip
};
