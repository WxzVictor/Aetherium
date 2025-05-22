import { DataTypes } from 'sequelize';
import sequelize from '../../db.js';

const Airports = sequelize.define('Airports', {
    airportCode: { type: DataTypes.STRING(10), primaryKey: true },
    airportName: { type: DataTypes.STRING(255), allowNull: false },
    city: { type: DataTypes.STRING(100), allowNull: false },
    countryCode: { type: DataTypes.STRING(10), allowNull: false },
    latitude: { type: DataTypes.FLOAT, allowNull: false },
    longitude: { type: DataTypes.FLOAT, allowNull: false },
    elvationFeet: { type: DataTypes.INTEGER, allowNull: false },
    regionCode: { type: DataTypes.STRING(10), allowNull: false }
}, {
    tableName: 'airports',
    timestamps: false
})
export default Airports