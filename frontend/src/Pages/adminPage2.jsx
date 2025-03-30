import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Admin() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(null);
  const [userId, setUserId] = useState(null);
  const [restaurantName, setRestaurantName] = useState(""); 
  const [restaurantPhoto, setRestaurantPhoto] = useState(null);
  const [availableTables, setAvailableTables] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:5000/admin", { withCredentials: true });

        if (res.data.status && res.data.role === "owner") {
          setUsername(res.data.name)
          setUser(res.data.user);
          setUserId(res.data.userId);
          fetchRestaurant(res.data.userId)
        } else {
          navigate("/login");
        }
      } catch (error) {
        navigate("/login");
      }
    };

    const fetchRestaurant = async (ownerId) => {
        try {
            const res = await axios.get(`http://localhost:5000/admin/restaurant/owner/${ownerId}`);
            if (res.data.restaurant) {
                navigate(`/admin/restaurant/${res.data.restaurant.id}`);
            }
        } catch (error) {
            console.error("Error fetching restaurant:", error);
        }
    };

    checkAuth();
  }, [navigate]);

  const handleAddRestaurant = async () => {
    if (!restaurantName || !restaurantPhoto || !availableTables) {
      alert("Please fill all fields (Name, Photo, Tables)"); 
      return; 
    }
    const formData = new FormData(); 
    formData.append("ownerId", userId);
    formData.append("name", restaurantName);
    formData.append("availableTables", availableTables);
    formData.append("photo", restaurantPhoto);

    try {
      const res = await axios.post(
        "http://localhost:5000/admin/restaurant/",
        formData,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      ); 
      
      if (res.status === 201) {
        const restaurantId = res.data.restaurant._id;
        navigate(`/admin/restaurant/${restaurantId}`);
      }
      setRestaurantName("");
      setRestaurantPhoto(null);
      setAvailableTables("");
    } catch (error) {
      console.log("Error adding restaurant:", error); 
      alert("Failed to add Restaurant");
    }
  }; 
   
  return (
    <div className="admin-page-container">
      <div className="admin-header">
        <h1 className="welcome-message">Welcome, {username || "Admin"}</h1>
      </div>

      <div className="restaurant-form">
        <h2 className="form-title">Create Your Restaurant</h2>
        
        <div className="form-group">
          <label className="form-label">Restaurant Name</label>
          <input
            type="text"
            className="form-input"
            placeholder="Enter restaurant name"
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Restaurant Photo</label>
          <div className="file-input-container">
            <input
              type="file"
              accept="image/*"
              id="restaurantPhoto"
              className="file-input"
              onChange={(e) => setRestaurantPhoto(e.target.files[0])}
            />
            <label htmlFor="restaurantPhoto" className="file-input-label">
              {restaurantPhoto ? restaurantPhoto.name : "Choose file"}
            </label>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Total Available Tables</label>
          <input
            type="number"
            className="form-input"
            placeholder="Enter number of tables"
            value={availableTables}
            onChange={(e) => setAvailableTables(e.target.value)}
            min="1"
          />
        </div>

        <button
          className="submit-button"
          onClick={handleAddRestaurant}
        >
          Add Restaurant
        </button>
      </div>
    </div>
  );
}