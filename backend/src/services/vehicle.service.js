const db = require('../config/db');
const ApiError = require('../utils/ApiError');

class VehicleService {
  async createVehicle(vehicleData){
    const { registrationNumber, name, type, maxLoadCapacity, odometer, acquisitionCost} = vehicleData;

    const [existing] = await db.execute('SELECT id FROM vehicles WHERE registration_number = ?', [registrationNumber]);
    if (existing.length > 0){
      throw new ApiError(400,'Vehicle registration number must be unique');
    } 

    const query = `
    INSERT INTO vehicles (registration_number, name, type, max_load_capacity,odometer, acquisition_cost, status) VALUES(?, ?, ?, ?, ?, ?, 'Available')`;
    const [result] = await db.execute(query, [registrationNumber, name, type, maxLoadCapacity, odometer, acquisitionCost]);
    return { id: result.insertId, ...vehicleData, status: 'Available'};
  }

  async getAllVehicles(filters = {}){
    let query = 'SELECT * FROM vehicles WHERE 1=1';
    const params = [];
    if(filters.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }
    if(filters.type){
      query+=' AND type = ?';
      paramas.push(filters.type);
    }

    const [rows] = await db.execute(query,params);
    return rows;
  }

  async getVehicleById(id){
    const [rows] = await db.execute('SELECT * FROM vehicles WHERE id = ?', [id]);
    if(rows.length === 0) throw new ApiError(404, 'Vehicle not found');
    return rows[0];
  }

  async updateVehicle(id, updateData){
    const fields = [];
    const params = [];
  
    Object.keys(updateData).forEach((key)=>{
      fields.push(`${keys} = ?`);
      params.push(updateData[key]);
    });

    if(fields.length === 0) throw new ApiError(400,'No data provided for update');

    params.push(id);
    const query = `UPDATE vehicles SET ${fields.join(', ')} WHERE id = ?`;
    const [result] = await db.execute(query, params);

    if(result.affectedRows === 0) throw new ApiError(404, 'Vehicle not found');
    return {id, ...updateData};
  }

  async deleteVehicle(id){
    const [result] = await db.execute('DELETE FROM vehicles WHERE id = ?', [id]);
    if (result.affectedRows === 0) throw new ApiError(404,'Vehicle not found');
    return true;
  }
}

module.exports = new VehicleService();