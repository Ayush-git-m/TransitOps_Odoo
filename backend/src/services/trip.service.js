const db = require("../config/db");

const createTrip = async (tripData) => {

    const connection = await db.getConnection();

    try {

        await connection.beginTransaction();

        const {
            vehicle_id,
            driver_id,
            source,
            destination,
            cargo_weight,
            planned_distance
        } = tripData;

        // Check Vehicle

        const [vehicle] = await connection.query(
            "SELECT * FROM vehicles WHERE id = ?",
            [vehicle_id]
        );

        if (vehicle.length === 0) {
            throw new Error("Vehicle not found");
        }

        if (vehicle[0].status !== "AVAILABLE") {
            throw new Error("Vehicle is not available");
        }

        // Check Driver

        const [driver] = await connection.query(
            "SELECT * FROM drivers WHERE id = ?",
            [driver_id]
        );

        if (driver.length === 0) {
            throw new Error("Driver not found");
        }

        if (driver[0].status !== "AVAILABLE") {
            throw new Error("Driver is not available");
        }

        // Create Trip

        const [trip] = await connection.query(
            `
            INSERT INTO trips
            (
                vehicle_id,
                driver_id,
                source,
                destination,
                cargo_weight,
                planned_distance
            )
            VALUES(?,?,?,?,?,?)
            `,
            [
                vehicle_id,
                driver_id,
                source,
                destination,
                cargo_weight,
                planned_distance
            ]
        );

        await connection.commit();

        return {
            trip_id: trip.insertId
        };

    } catch (error) {

        await connection.rollback();

        throw error;

    } finally {

        connection.release();

    }

};

const dispatchTrip = async (tripId) => {

    const connection = await db.getConnection();

    try {

        await connection.beginTransaction();

        const [trip] = await connection.query(
            "SELECT * FROM trips WHERE id = ?",
            [tripId]
        );

        if (trip.length === 0) {
            throw new Error("Trip not found");
        }

        // Apne status ke hisaab se change karna:
        // Agar trips default DRAFT me banti hai to DRAFT rakho.
        // Agar PLANNED hai to PLANNED rakho.

        if (trip[0].status !== "DRAFT") {
            throw new Error("Only draft trips can be dispatched");
        }

        await connection.query(
            "UPDATE vehicles SET status='ON_TRIP' WHERE id=?",
            [trip[0].vehicle_id]
        );

        await connection.query(
            "UPDATE drivers SET status='ON_TRIP' WHERE id=?",
            [trip[0].driver_id]
        );

        await connection.query(
            `
            UPDATE trips
            SET status='DISPATCHED',
                dispatch_time=NOW()
            WHERE id=?
            `,
            [tripId]
        );

        await connection.commit();

        return {
            tripId,
            status: "DISPATCHED"
        };

    } catch (error) {

        await connection.rollback();
        throw error;

    } finally {

        connection.release();

    }

};

const completeTrip = async (tripId) => {

    const connection = await db.getConnection();

    try {

        await connection.beginTransaction();

        const [trip] = await connection.query(
            "SELECT * FROM trips WHERE id=?",
            [tripId]
        );

        if (trip.length === 0) {
            throw new Error("Trip not found");
        }

        if (trip[0].status !== "DISPATCHED") {
            throw new Error("Only dispatched trips can be completed");
        }

        await connection.query(
            `
            UPDATE trips
            SET
                status='COMPLETED',
                completion_time=NOW()
            WHERE id=?
            `,
            [tripId]
        );

        await connection.query(
            "UPDATE vehicles SET status='AVAILABLE' WHERE id=?",
            [trip[0].vehicle_id]
        );

        await connection.query(
            "UPDATE drivers SET status='AVAILABLE' WHERE id=?",
            [trip[0].driver_id]
        );

        await connection.commit();

        return {
            tripId,
            status: "COMPLETED"
        };

    } catch (error) {

        await connection.rollback();
        throw error;

    } finally {

        connection.release();

    }

};

const getAllTrips = async () => {

    const [rows] = await db.query(`
        SELECT
            t.id,
            t.source,
            t.destination,
            t.status,
            t.dispatch_time,
            t.completion_time,

            v.registration_number,

            d.full_name AS driver_name

        FROM trips t

        JOIN vehicles v
            ON t.vehicle_id = v.id

        JOIN drivers d
            ON t.driver_id = d.id

        ORDER BY t.created_at DESC
    `);

    return rows;
};

module.exports = {
    createTrip,
    dispatchTrip,
    completeTrip,
    getAllTrips
};
