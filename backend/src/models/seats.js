import { DataTypes } from 'sequelize';
import sequelize from '../../db.mjs';

const Seats = sequelize.define('Seats', {
    seatId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    flightId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Flights', key: 'flightId' }, onDelete: 'CASCADE' },
    seatNumber: { type: DataTypes.ENUM('A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3'), allowNull: false },
    seatClass: { type: DataTypes.ENUM('economy', 'business', 'first'), allowNull: false },
    seatType: { type: DataTypes.ENUM('aisle', 'window', 'middle'), allowNull: false },
    seatStatus: { type: DataTypes.BOOLEAN, allowNull: false }
}, {
    timestamps: false
})
export default Seats