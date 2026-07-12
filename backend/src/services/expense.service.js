const db = require('../config/db');
const ApiError = require('../utils/ApiError');

class ExpenseService {
  async logExpense(expenseData) {
    const { vehicleId, type, cost, date, description } = expenseData;

    const [vehicle] = await db.execute('SELECT id FROM vehicles WHERE id = ?', [vehicleId]);
    if (vehicle.length === 0) throw new ApiError(404, 'Vehicle not found');

    const query = `
      INSERT INTO expenses (vehicle_id, type, cost, date, description)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(query, [vehicleId, type, cost, date, description]);
    return { id: result.insertId, ...expenseData };
  }
}

module.exports = new ExpenseService();