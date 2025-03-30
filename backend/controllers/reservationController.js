import Reservation from '../models/Reservation.js';
import { sendEmail } from '../utils/emailService.js';
import User from '../models/User.js'
import Restaurant from '../models/Restaurant.js';
export const createReservationRequest = async (req,res) => {
    try {
        const {userId, restaurantId, time,date} = req.body;
        console.log(userId);
        console.log(restaurantId);
        if (!userId || !restaurantId || !time || !date) {
            return res.status(404).json({message: "All fields are required"})
        }
        const newReservation = await Reservation.create({
            user_id : userId,
            restaurant_id :restaurantId, 
            date: date,
            time: time, 
            status: "pending", 
        })

        res.status(201).json({message:"reservation request sent", reservation: newReservation})
    } catch (error) {
        console.log("error creating reservation"); 
        res.status(500).json({message: "Server Error", error: error.message }); 
    }
}

export const cancelReservationRequest = async (req, res) => {
    try {
        const { id } = req.params;

        const reservation = await Reservation.findById(id);
        if (!reservation) {
            return res.status(404).json({ message: "Reservation not found" });
        }
        if (reservation.status !== "pending") {
            return res.status(400).json({ message: "Cannot cancel an approved or declined reservation" });
        }

        await Reservation.findByIdAndDelete(id);
        res.status(200).json({ message: "Reservation request canceled" });
    } catch (error) {
        res.status(500).json({ message: "Server error" , error: error.message});
    }
};

export const updateReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; 
        const reservation = await Reservation.findByPk(id, {
            include: { model: User, attributes: ["name", "email"] } ,// Equivalent to Mongoose populate()
            include: {model :Restaurant, attributes: ["name"]}
        });
        if (!reservation) {
            return res.status(404).json({ message: "Reservation not found" });
        }
        const updatedReservation = await reservation.update({ status }, { where: { id } });

        if (!updatedReservation) {
            return res.status(404).json({ message: "Reservation not found" });
        }

        console.log(process.env.EMAIL_USER)
        console.log(process.env.EMAIL_PASS)
        const userEmail = reservation.User.email;
        const subject = `Your Reservation Status: ${status}`;
        const message = `Hello ${reservation.User.name},\n\nYour reservation at ${reservation.Restaurant.name} has been ${status}.\n\nThank you!`;

        sendEmail(userEmail, subject, message);

        res.status(200).json(updatedReservation);
    } catch (error) {
        res.status(500).json({ message: "Error updating reservation", error: error.message });
    }
};

export const getPendingReservations = async (req, res) => {
    try {
        console.log("Received request params:", req.params);
        const { id } = req.params;
        const reservations = await Reservation.findAll({
            where: { restaurant_id: id, status: "pending" },
            include: {
                model: User,
                attributes: ["id", "name", "email"] // Fetch user details
            }
        });
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ message: "Error fetching reservations", error: error.message });
    }
};

