import Restaurant from "../models/Restaurant.js"
import mongoose from 'mongoose'
import multer from 'multer'
import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";
import Menu from "../models/Menu.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendRoot = path.resolve(__dirname, ".."); // Move one level up to backend root

const uploadDir = path.join(backendRoot, "uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}


// Configure Multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Save files in uploads folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

export const upload = multer({ storage });


export const createRestaurant = async (req, res) => {
    try {
        console.log(req.body)
        console.log(req.file)
        const { ownerId, name, availableTables } = req.body;
        const photo = req.file ? `uploads/${req.file.filename}` : ""; 

        if (!ownerId || !name || !availableTables || !photo) {
            return res.status(400).json({ error: "All fields are required, including a photo" });
        }

        const newRestaurant = await Restaurant.create({
            owner_id :ownerId,
            name: name,
            photo: photo,  // Store image path in DB
        });

        res.status(201).json({ message: "Restaurant created successfully", restaurant: newRestaurant });

    } catch (error) {
        console.error("Error creating restaurant:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteRestaurant = async (req, res) => {
    try {
        const { id } = req.params;

        const restaurant = await Restaurant.findById(id);
        if (!reservation) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        await Restaurant.findByIdAndDelete(id);
        res.status(200).json({ message: "Restaurant deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error" , error: error.message});
    }
};

export const getRestaurantList = async (req, res) => {
    try {
        console.log("getting restaurants")
        const restaurants = await Restaurant.findAll();
        res.status(200).json(restaurants);
    } catch (error) {
        console.error("Error fetching restaurant list:", error);
        res.status(500).json({ message: "Server error while fetching restaurants" });
    }
};


export const getRestaurantByOwner = async (req, res) => {
    try {
        console.log("Received request params:", req.params); // Debugging
        const { id } = req.params; 
        if (!id) {
            return res.status(400).json({ error: "Owner ID is required" });
        }
        const restaurant = await Restaurant.findOne({ where: {owner_id: id} }); 
        if (!restaurant) {
            return res.status(404).json({ message: "No Restaurant found" });
        }
        res.status(200).json({ restaurant });
    } catch (error) {
        console.error("Error fetching restaurant:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const addItemToMenu = async (req,res) => {
    try {
        const { name, price } = req.body; 
        const {id} = req.params; 
        if (!name || !price) {
            return res.status(400).json({ error: "Name, price are required" });
        } 
        const restaurant = await Restaurant.findByPk(id); 
        if (!restaurant) {
            return res.status(404).json({error: "restaurant not found"})
        }

        const newMenuItem = await Menu.create({
            restaurant_id: id,
            name,
            price
        });

        res.status(201).json({ message: "Menu item added successfully", menuItem: newMenuItem });
    } catch (error) {
        console.error("Error adding menu item:", error);
        res.status(500).json({ error: "Server error" });
    }
}

export const getMenu = async (req, res) => {
    
    try {
        const {id} = req.params;
        const menuItems = await Menu.findAll({
            where: { restaurant_id: id },
            attributes: ['id', 'name', 'price'] // Fetch only required fields
        });
        res.status(200).json(menuItems);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch menu" });
    }
};