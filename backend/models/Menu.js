import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import Restaurant from './Restaurant.js';

const Menu = sequelize.define('Menu', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
}); 

// Define Relationship (A Restaurant has Many Menu Items)
Menu.belongsTo(Restaurant, { foreignKey: 'restaurant_id', onDelete: 'CASCADE' });
Restaurant.hasMany(Menu, { foreignKey: 'restaurant_id' });

export default Menu;
