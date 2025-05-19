import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const User = sequelize.define('User', {
    userId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    firstName: { type: DataTypes.STRING(50), allowNull: false },
    lastName: { type: DataTypes.STRING(50), allowNull: false },
    email: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    hashedPassword: { type: DataTypes.STRING(255), allowNull: false },
    age: { type: DataTypes.INTEGER, allowNull: false},
    gender: { type: DataTypes.ENUM("male", "female", "other"), allowNull: false },
    address: { type: DataTypes.STRING(255), allowNull: false },
    city: { type: DataTypes.STRING(50), allowNull: false },
    country: { type: DataTypes.STRING(50), allowNull: false },
    signupDate: { type: DataTypes.DATE, allowNull: false }
})
export default User