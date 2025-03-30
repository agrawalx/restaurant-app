import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminRestaurantPage = () => {
    const { id } = useParams();
    const navigate = useNavigate(); 
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:5000/reservation/restaurant/${id}`, {withCredentials: true})
            .then(response => {
                setReservations(Array.isArray(response.data) ? response.data : []);
            })
            .catch(error => {
                console.error("Error fetching reservations:", error);
                setReservations([]);
            });
    }, [id]);

    const handleUpdateStatus = (id, status) => {
        axios.put(`http://localhost:5000/reservation/${id}`, { status })
            .then((response) => {
                setReservations(reservations.map(res => 
                    res.id === id ? { ...res, status: response.data.status } : res
                ));
            })
            .catch(error => console.error("Error updating reservation:", error));
    };

    return (
        <div className="admin-restaurant-container">
            <div className="header-section">
                <h1 className="page-title">Restaurant Dashboard</h1>
                <button 
                    onClick={() => navigate(`/admin/restaurant/${id}/menu`)} 
                    className="menu-button"
                >
                    Manage Menu
                </button>
            </div>
            
            <div className="reservations-section">
                <h2 className="section-title">Reservations for Your Restaurant</h2>
                
                {reservations.length === 0 ? (
                    <p className="no-reservations">No reservation requests yet.</p>
                ) : (
                    <div className="table-container">
                        <table className="reservations-table">
                            <thead>
                                <tr>
                                    <th>User Name</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservations.map(reservation => (
                                    <tr key={reservation._id}>
                                        <td>{reservation.userName}</td>
                                        <td>{new Date(reservation.date).toLocaleDateString()}</td>
                                        <td>{reservation.time}</td>
                                        <td>
                                            <span className={`status-badge ${reservation.status}`}>
                                                {reservation.status}
                                            </span>
                                        </td>
                                        <td>
                                            {reservation.status === "pending" && (
                                                <div className="action-buttons">
                                                    <button 
                                                        onClick={() => handleUpdateStatus(reservation.id, "approved")}
                                                        className="approve-button"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button 
                                                        onClick={() => handleUpdateStatus(reservation.id, "cancelled")}
                                                        className="cancel-button"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminRestaurantPage;