const dashboardService = require("../services/dashboard.service");

const getSummary = async (req, res) => {

    try {

        const data = await dashboardService.getSummary();

        res.status(200).json({
            success: true,
            data
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const getRecentTrips = async (req, res) => {};

const getTopCostlyVehicles = async (req, res) => {};

const getVehicleStatus = async (req, res) => {};

const getAnalytics = async (req, res) => {};

module.exports = {
    getSummary,
    getRecentTrips,
    getTopCostlyVehicles,
    getVehicleStatus,
    getAnalytics
};
