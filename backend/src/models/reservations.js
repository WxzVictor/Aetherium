import { DataTypes } from 'sequelize';
import sequelize from '../../db.js';

const Reservations = sequelize.define('Reservations', {
    reservationId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Users', key: 'userId' }, onDelete: 'CASCADE' },
    flightId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Flights', key: 'flightId' }, onDelete: 'CASCADE' },
    seatId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Seats', key: 'seatId' }, onDelete: 'CASCADE' },
    reservationDateTime: { type: DataTypes.DATE, allowNull: false, defaultValue: sequelize.literal('CURRENT_TIMESTAMP') },
}, {
    timestamps: false
})
export default Reservations