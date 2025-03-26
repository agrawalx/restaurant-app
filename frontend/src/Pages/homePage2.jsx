import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Button, Card, CardContent, Dialog, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

const RestaurantList = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [reservation, setReservation] = useState({ date: "", time: "" });
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.userId);
      } catch (error) {
        alert("Login first");
        console.error("Login first:", error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get("http://localhost:5000/restaurant/");
        setRestaurants(response.data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };
    fetchRestaurants();
  }, []);

  const handleOpen = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRestaurant(null);
    setReservation({ date: "", time: "" });
  };

  const handleReserve = async () => {
    if (!reservation.date || !reservation.time) {
      alert("Please select a date and time.");
      return;
    }
    try {
      await axios.post("http://localhost:5000/reservation/", {
        userId: userId,
        restaurantId: selectedRestaurant._id,
        date: reservation.date,
        time: reservation.time,
      });
      alert("Reservation request sent!");
      handleClose();
    } catch (error) {
      console.error("Error creating reservation:", error);
    }
  };

  return (
    <div className="restaurant-page">
      {/* Hero Section */}
      <div className="hero-section">
        <h1 className="site-name">DineEase</h1>
        <h2 className="shop-title">Discover Amazing Restaurants</h2>
        <p className="subheading">Find and reserve at the best dining spots in town</p>
        <Button variant="contained" color="primary" className="hero-button">
          EXPLORE NOW
        </Button>
        <div className="divider"></div>
      </div>

      {/* Restaurants Section */}
      <div className="restaurants-section">
        <h2 className="section-heading">Featured Restaurants</h2>
        <p className="section-subheading">Check out our top picks for you</p>
        
        <div className="restaurants-list">
          {restaurants.map((restaurant, index) => (
            <div 
              key={restaurant._id} 
              className={`restaurant-item ${index % 2 === 0 ? 'left-aligned' : 'right-aligned'}`}
            >
              <div className="restaurant-content">
                <img
                  src={`http://localhost:5000/${restaurant.photo}`}
                  alt={restaurant.name}
                  className="restaurant-image"
                />
                <div className="restaurant-details">
                  <h3 className="restaurant-name">{restaurant.name}</h3>
                  <div className="button-group">
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={() => handleOpen(restaurant)}
                      className="primary-button"
                    >
                      RESERVE
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => navigate(`/restaurant/${restaurant._id}/menu`)}
                      className="secondary-button"
                    >
                      SEE MENU
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <h2 className="section-heading">Ready to dine with us?</h2>
        <p className="section-subheading">Make a reservation today and enjoy your meal</p>
        <div className="button-group">
          <Button variant="contained" color="primary" className="primary-button">
            BOOK NOW
          </Button>
          <Button variant="outlined" color="secondary" className="secondary-button">
            LEARN MORE
          </Button>
        </div>
      </div>

      {/* Reservation Modal */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Reserve at {selectedRestaurant?.name}</DialogTitle>
        <DialogContent>
          <TextField
            label="Date"
            type="date"
            fullWidth
            value={reservation.date}
            onChange={(e) => setReservation({ ...reservation, date: e.target.value })}
            className="reservation-field"
          />
          <TextField
            label="Time"
            type="time"
            fullWidth
            value={reservation.time}
            onChange={(e) => setReservation({ ...reservation, time: e.target.value })}
            className="reservation-field"
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleReserve} 
            className="submit-button"
          >
            Submit Reservation
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RestaurantList;