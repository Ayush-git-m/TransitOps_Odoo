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

const getRecentTrips = async () => {

    const [rows] = await db.query(`
        SELECT
            t.id,
            t.source,
            t.destination,
            t.status,
            t.dispatch_time,

            d.full_name AS driver_name,

            v.registration_number

        FROM trips t

        JOIN drivers d
            ON t.driver_id = d.id

        JOIN vehicles v
            ON t.vehicle_id = v.id

        ORDER BY t.created_at DESC

        LIMIT 5
    `);

    return rows;

};
const getVehicleStatus = async () => {

    const [rows] = await db.query(`
        SELECT
            status,
            COUNT(*) AS total
        FROM vehicles
        GROUP BY status
    `);

    return rows;

};

const getAnalytics = async () => {

    const [[totalTrips]] = await db.query(`
        SELECT COUNT(*) AS totalTrips
        FROM trips
    `);

    const [[completedTrips]] = await db.query(`
        SELECT COUNT(*) AS completedTrips
        FROM trips
        WHERE status='COMPLETED'
    `);

    const [[activeTrips]] = await db.query(`
        SELECT COUNT(*) AS activeTrips
        FROM trips
        WHERE status='DISPATCHED'
    `);

    const [[availableVehicles]] = await db.query(`
        SELECT COUNT(*) AS availableVehicles
        FROM vehicles
        WHERE status='AVAILABLE'
    `);

    const [[onTripVehicles]] = await db.query(`
        SELECT COUNT(*) AS onTripVehicles
        FROM vehicles
        WHERE status='ON_TRIP'
    `);

    return {

        totalTrips: totalTrips.totalTrips,

        completedTrips: completedTrips.completedTrips,

        activeTrips: activeTrips.activeTrips,

        availableVehicles: availableVehicles.availableVehicles,

        onTripVehicles: onTripVehicles.onTripVehicles

    };

};

const getTopCostlyVehicles = async () => {

    const [rows] = await db.query(`
        SELECT
            v.id,
            v.registration_number,
            COALESCE(SUM(e.amount),0) AS totalExpense

        FROM vehicles v

        LEFT JOIN expenses e
            ON v.id = e.vehicle_id

        GROUP BY
            v.id,
            v.registration_number

        ORDER BY totalExpense DESC

        LIMIT 5
    `);

    return rows;

};
module.exports = {
    getSummary,
    getRecentTrips,
    getVehicleStatus,
    getAnalytics,
    getTopCostlyVehicles
    
};
