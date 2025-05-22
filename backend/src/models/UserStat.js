import { DataTypes } from 'sequelize';
import sequelize from '../../db.js';

const userStats = sequelize.define('userStats', {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    totalFlights: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    totalHours: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    firstFlight: { type: DataTypes.DATE },
    lastFlight: { type: DataTypes.DATE },
    timesInFirstClass: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    mostUsedAirline: { type: DataTypes.STRING(100) },
    totalSpent: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 }
}, {
    tableName: 'userStats',
    timestamps: false
})
export default userStats