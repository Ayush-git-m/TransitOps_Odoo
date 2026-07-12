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

const getRecentTrips = async (req, res) => {

    try {

        const data = await dashboardService.getRecentTrips();

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

const getTopCostlyVehicles = async (req, res) => {

    try {

        const data = await dashboardService.getTopCostlyVehicles();

        return res.status(200).json({
            success: true,
            data
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const getVehicleStatus = async (req, res) => {

    try {

        const data = await dashboardService.getVehicleStatus();

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

const getAnalytics = async (req, res) => {

    try {

        const data = await dashboardService.getAnalytics();

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

module.exports = {
    getSummary,
    getRecentTrips,
    getTopCostlyVehicles,
    getVehicleStatus,
    getAnalytics,
    getTopCostlyVehicles
};
