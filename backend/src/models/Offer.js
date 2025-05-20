import { DataTypes } from 'sequelize';
import sequelize from '../../db.mjs';

const Offers = sequelize.define('offers', {
    offerId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    flightId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'flights', key: 'flightId' }, onDelete: 'CASCADE' },
    hotelId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'hotels', key: 'hotelId' }, onDelete: 'CASCADE' },
    discountPercentage: { type: DataTypes.INTEGER, allowNull: false },
    startDate: { type: DataTypes.DATE, allowNull: false },
    endDate: { type: DataTypes.DATE, allowNull: false }
}, {
    tableName: 'offers',
    timestamps: false
})
export default Offers