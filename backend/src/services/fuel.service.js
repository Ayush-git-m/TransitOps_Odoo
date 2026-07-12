const db = require('../config/db');
const ApiError = require('../utils/ApiError');

class FuelService {
  async logFuel(fuelData) {
    const { vehicleId, liters, cost, date } = fuelData;

    const [vehicle] = await db.execute('SELECT id FROM vehicles WHERE id = ?', [vehicleId]);
    if (vehicle.length === 0) throw new ApiError(404, 'Vehicle not found');

    const query = `
      INSERT INTO fuel_logs (vehicle_id, liters, cost, date)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await db.execute(query, [vehicleId, liters, cost, date]);
    return { id: result.insertId, ...fuelData };
  }
}

module.exports = new FuelService();