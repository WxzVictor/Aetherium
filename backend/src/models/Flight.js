import { DataTypes } from 'sequelize';
import sequelize from '../../db.js';

const Flights = sequelize.define('Flights', {
    flightId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    flightNumber: { type: DataTypes.STRING(20), allowNull: false },
    airlineName: { type: DataTypes.STRING(100), allowNull: false },
    flightCode: { type: DataTypes.STRING(10), allowNull: false },
    departureAirportCode: { type: DataTypes.STRING(10), allowNull: false, references: { model: 'Airports', key: 'airportCode' }, onDelete: 'CASCADE' },
    arrivalAirportCode: { type: DataTypes.STRING(10), allowNull: false, references: { model: 'Airports', key: 'airportCode' }, onDelete: 'CASCADE' },
    departureTime: { type: DataTypes.DATE, allowNull: false },
    arrivalTime: { type: DataTypes.DATE, allowNull: false },
    durationMinutes: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
},{
    tableName: 'flights',
    timestamps: false
});
export default Flights