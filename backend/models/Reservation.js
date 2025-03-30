import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './User.js';
import Restaurant from './Restaurant.js';

const Reservation = sequelize.define("Reservation", {
    id: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    user_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { model: User, key: "id" } 
    },
    restaurant_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { model: Restaurant, key: "id" } 
    },
    time: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    date: { 
        type: DataTypes.DATEONLY, 
        allowNull: false 
    },
    status: { 
        type: DataTypes.ENUM("pending", "confirmed", "cancelled"), 
        defaultValue: "pending" 
    }
});

// Define Relationships
Reservation.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
User.hasMany(Reservation, { foreignKey: 'user_id' });

Reservation.belongsTo(Restaurant, { foreignKey: 'restaurant_id', onDelete: 'CASCADE' });
Restaurant.hasMany(Reservation, { foreignKey: 'restaurant_id' });

export default Reservation;
