import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function AdminMenu() {
    const [menuName, setMenuName] = useState("");
    const [menuPrice, setMenuPrice] = useState("");
    const [menuItems, setMenuItems] = useState([]); 
    const { id } = useParams();

    useEffect(() => {
        axios.get(`https://restaurant-app-nu-six.vercel.app/admin/restaurant/${id}/menu`)
            .then(response => setMenuItems(response.data))
            .catch(error => console.error("Error fetching menu:", error));
    }, [id]);
    
    const handleAddMenuItem = async () => {
        try {
            const res = await axios.post(`https://restaurant-app-nu-six.vercel.app/restaurant/${id}/menu`, {
                name: menuName,
                price: menuPrice
            });

            if (res.status === 201) {
                alert("Menu item added successfully!");
                setMenuName("");
                setMenuPrice("");
                // Refresh menu items after adding new one
                const updatedMenu = await axios.get(`https://restaurant-app-nu-six.vercel.app/admin/restaurant/${id}/menu`);
                setMenuItems(updatedMenu.data);
            }
        } catch (error) {
            console.error("Error adding menu item:", error);
            alert("Failed to add menu item");
        }
    };

    return (
        <div className="admin-menu-container">
            <div className="menu-form">
                <h2 className="form-title">Add Menu Item</h2>
                
                <div className="form-group">
                    <label className="form-label">Dish Name</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Enter dish name"
                        value={menuName}
                        onChange={(e) => setMenuName(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Price (₹)</label>
                    <input
                        type="number"
                        className="form-input"
                        placeholder="Enter price"
                        value={menuPrice}
                        onChange={(e) => setMenuPrice(e.target.value)}
                    />
                </div>

                <button
                    className="submit-button"
                    onClick={handleAddMenuItem}
                >
                    Add Menu Item
                </button>
            </div>

            <div className="current-menu">
                <h3 className="menu-title">Current Menu</h3>
                {menuItems.length === 0 ? (
                    <p className="empty-menu">No menu items yet</p>
                ) : (
                    <table className="menu-table">
                        <thead>
                            <tr>
                                <th>Dish Name</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {menuItems.map(item => (
                                <tr key={item._id}>
                                    <td>{item.name}</td>
                                    <td>₹{item.price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}