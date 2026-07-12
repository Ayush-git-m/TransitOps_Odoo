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

const dispatchTrip = async (req, res) => {

    try {

        const result = await tripService.dispatchTrip(req.params.id);

        res.status(200).json({
            success: true,
            message: "Trip Dispatched Successfully",
            data: result
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }

};


const getAllTrips = async (req, res) => {  try {

        const trips = await tripService.getAllTrips();

        return res.status(200).json({
            success: true,
            data: trips
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }};

const getTripById = async (req, res) => {};


const completeTrip = async (req, res) => { try {

        const result = await tripService.completeTrip(req.params.id);

        res.status(200).json({
            success: true,
            message: "Trip Completed Successfully",
            data: result
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }
};

const cancelTrip = async (req, res) => {};

module.exports = {
    createTrip,
    getAllTrips,
    getTripById,
    dispatchTrip,
    completeTrip,
    cancelTrip
};
