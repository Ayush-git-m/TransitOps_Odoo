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

module.exports = {
    createTrip
};
