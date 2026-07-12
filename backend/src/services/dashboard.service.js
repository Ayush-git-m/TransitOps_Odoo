const db = require("../config/db");

const getSummary = async () => {

    const [[vehicles]] = await db.query(
        "SELECT COUNT(*) AS totalVehicles FROM vehicles"
    );

    const [[drivers]] = await db.query(
        "SELECT COUNT(*) AS totalDrivers FROM drivers"
    );

    const [[trips]] = await db.query(
        "SELECT COUNT(*) AS totalTrips FROM trips"
    );

    const [[activeTrips]] = await db.query(
        "SELECT COUNT(*) AS activeTrips FROM trips WHERE status='DISPATCHED'"
    );

    const [[availableVehicles]] = await db.query(
        "SELECT COUNT(*) AS availableVehicles FROM vehicles WHERE status='AVAILABLE'"
    );

    return {

        totalVehicles: vehicles.totalVehicles,

        totalDrivers: drivers.totalDrivers,

        totalTrips: trips.totalTrips,

        activeTrips: activeTrips.activeTrips,

        availableVehicles: availableVehicles.availableVehicles

    };

};

module.exports = {
    getSummary
};
