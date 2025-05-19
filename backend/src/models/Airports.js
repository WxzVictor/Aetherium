import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Airports = sequelize.define('Airports', {
    airportCode: { type: DataTypes.String(10), primaryKey: true },
    airportName: { type: DataTypes.String(255), allowNull: false },
    city: { type: DataTypes.String(100), allowNull: false },
    countryCode: { type: DataTypes.String(10), allowNull: false },
    latitude: { type: DataTypes.Float, allowNull: false },
    longitude: { type: DataTypes.Float, allowNull: false },
    elvationFeet: { type: DataTypes.Integer, allowNull: false },
    regionCode: { type: DataTypes.String(10), allowNull: false }
})
export default Airports