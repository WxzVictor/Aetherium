import { DataTypes } from 'sequelize';
import sequelize from '../../db.js';

const Users = sequelize.define('Users', {
    userId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    firstName: { type: DataTypes.STRING(50), allowNull: false },
    lastName: { type: DataTypes.STRING(50), allowNull: false },
    email: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    age: { type: DataTypes.INTEGER, allowNull: false},
    signupDate: { type: DataTypes.DATE, allowNull: false, defaultValue: sequelize.literal('CURRENT_TIMESTAMP') }
})
export default Users