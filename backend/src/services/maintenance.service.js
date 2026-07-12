const db = require('../config/db');
const ApiError = require('../utils/ApiError');

class MaintenanceService {
  async createLog(logData) {
    const { vehicleId, description, cost, startDate } = logData;
    
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const [vehicle] = await connection.execute('SELECT status FROM vehicles WHERE id = ?', [vehicleId]);
      if (vehicle.length === 0) throw new ApiError(404, 'Vehicle not found');

      const query = `
        INSERT INTO maintenance_logs (vehicle_id, description, cost, start_date, status)
        VALUES (?, ?, ?, ?, 'Active')
      `;
      const [result] = await connection.execute(query, [vehicleId, description, cost, startDate]);

      await connection.execute('UPDATE vehicles SET status = "In Shop" WHERE id = ?', [vehicleId]);

      await connection.commit();
      return { id: result.insertId, ...logData, status: 'Active' };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async closeLog(id, endDate) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const [log] = await connection.execute('SELECT vehicle_id, status FROM maintenance_logs WHERE id = ?', [id]);
      if (log.length === 0) throw new ApiError(404, 'Maintenance log not found');
      if (log[0].status === 'Closed') throw new ApiError(400, 'Log is already closed');

      await connection.execute(
        'UPDATE maintenance_logs SET status = "Closed", end_date = ? WHERE id = ?',
        [endDate, id]
      );

      const [vehicle] = await connection.execute('SELECT status FROM vehicles WHERE id = ?', [log[0].vehicle_id]);
      if (vehicle[0].status !== 'Retired') {
        await connection.execute('UPDATE vehicles SET status = "Available" WHERE id = ?', [log[0].vehicle_id]);
      }

      await connection.commit();
      return { id, status: 'Closed', endDate };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = new MaintenanceService();