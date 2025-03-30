import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './User.js';

const Restaurant = sequelize.define('Restaurant', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    photo: { type: DataTypes.TEXT, allowNull: false },
    // available_tables: { type: DataTypes.INTEGER, allowNull: false }
}); 

// Define Relationship (One User owns Many Restaurants)
Restaurant.belongsTo(User, { foreignKey: 'owner_id', onDelete: 'CASCADE' });
User.hasMany(Restaurant, { foreignKey: 'owner_id' });

export default Restaurant;
