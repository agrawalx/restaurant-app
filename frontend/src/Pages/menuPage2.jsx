import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UserMenuPage = () => {
    const { id } = useParams();
    const [menuItems, setMenuItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:5000/restaurant/${id}/menu`)
            .then(response => setMenuItems(response.data))
            .catch(error => console.error("Error fetching menu:", error));
    }, [id]);

    return (
        <div className="menu-page-container">
            <div className="menu-header">
                <h1 className="menu-title">Menu</h1>
                <button 
                    onClick={() => navigate("/home")}
                    className="back-button"
                >
                    ← Back to Restaurants
                </button>
            </div>
            
            {menuItems.length === 0 ? (
                <p className="empty-menu">No menu items available</p>
            ) : (
                <div className="menu-items-container">
                    <ul className="menu-list">
                        {menuItems.map(item => (
                            <li key={item._id} className="menu-item">
                                <span className="item-name">{item.name}</span>
                                <span className="item-price">₹{item.price}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default UserMenuPage;