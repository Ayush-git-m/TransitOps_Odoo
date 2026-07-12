const db = require('../config/db');
const ApiError = require('../utils/ApiError');

class DriverService {
  async createDriver(driverData) {
    const { name, licenseNumber, licenseCategory, licenseExpiryDate, contactNumber } = driverData;
    
    const query = `
      INSERT INTO drivers (name, license_number, license_category, license_expiry_date, contact_number, safety_score, status)
      VALUES (?, ?, ?, ?, ?, 100, 'Available')
    `;
    const [result] = await db.execute(query, [name, licenseNumber, licenseCategory, licenseExpiryDate, contactNumber]);
    return { id: result.insertId, ...driverData, safety_score: 100, status: 'Available' };
  }

  async getAllDrivers(filters = {}) {
    let query = 'SELECT * FROM drivers WHERE 1=1';
    const params = [];

    if (filters.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }

    const [rows] = await db.execute(query, params);
    return rows;
  }

  async getDriverById(id) {
    const [rows] = await db.execute('SELECT * FROM drivers WHERE id = ?', [id]);
    if (rows.length === 0) throw new ApiError(404, 'Driver not found');
    return rows[0];
  }

  async updateDriver(id, updateData) {
    const fields = [];
    const params = [];

    Object.keys(updateData).forEach((key) => {
      fields.push(`${key} = ?`);
      params.push(updateData[key]);
    });

    if (fields.length === 0) throw new ApiError(400, 'No data provided for update');

    params.push(id);
    const query = `UPDATE drivers SET ${fields.join(', ')} WHERE id = ?`;
    const [result] = await db.execute(query, params);

    if (result.affectedRows === 0) throw new ApiError(404, 'Driver not found');
    return { id, ...updateData };
  }

  async deleteDriver(id) {
    const [result] = await db.execute('DELETE FROM drivers WHERE id = ?', [id]);
    if (result.affectedRows === 0) throw new ApiError(404, 'Driver not found');
    return true;
  }
}

module.exports = new DriverService();