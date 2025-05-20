import { DataTypes } from 'sequelize';
import sequelize from '../../db.mjs';

const Hotels = sequelize.define('hotels', {
    hotelId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    hotelName: { type: DataType.STRING(255), allowNull: false },
    address: { type: DataTypes.STRING(255), allowNull: false },
    rating: { type: DataTypes.INTEGER, allowNull: false },
    contactNumber: { type: DataTypes.STRING(50), allowNull: false },
    pricePerNight: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    city: { type: DataTypes.STRING(50), allowNull: false },
    country: { type: DataTypes.STRING(50), allowNull: false },
    email: { type: DataTypes.STRING(100), allowNull: false },
    checkInTime: { type: DataTypes.DATE, allowNull: false },
    checkOutTime: { type: DataTypes.DATE, allowNull: false }
}, {
    tableName: 'hotels',
    timestamps: false
});

export default Hotels;