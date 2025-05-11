const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { db } = require("../firebase");
const dotenv = require("dotenv");
dotenv.config();

const usersCollection = process.env.FIRESTORE_COLLECTION_USERS;

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password || !phone || !address) {
      return res.status(400).json({ message: "Please fill the missing fields" });
    }

    const existingUser = await db
      .collection(usersCollection)
      .where("email", "==", email)
      .get();

    if (!existingUser.empty) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const newUserRef = await db.collection(usersCollection).add({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      phone,
      address,
      role: "user",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return res.status(201).json({ message: "User registered successfully", id: newUserRef.id });
  } catch (err) {
    console.error("Error registering user:", err);
    return res.status(500).json({ message: "Registration failed", error: err.message || "Internal error" });
  }
};

exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    
    if (!name || !email || !password || !phone || !address) {
      return res.status(400).json({ message: "Please fill the missing fields" });
    }
    
    const token = req.headers["x-admin-secret"];

    if (token !== process.env.AUTH_ADMIN_SECRET) {
      return res.status(403).json({ message: "Forbidden: Invalid admin token" });
    }

    const existingUser = await db
      .collection(usersCollection)
      .where("email", "==", email)
      .get();

    if (!existingUser.empty) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const newUserRef = await db.collection(usersCollection).add({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      phone,
      address,
      role: "admin",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return res.status(201).json({ message: "Admin user registered successfully", id: newUserRef.id });
  } catch (err) {
    console.error("Error registering admin user:", err);
    return res.status(500).json({ message: "Admin registration failed", error: err.message || "Internal error"});
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const snapshot = await db
      .collection(usersCollection)
      .where("email", "==", email)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "User not found" });
    }

    const doc = snapshot.docs[0]; // access the first document in the array
    const user = doc.data();

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: doc.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({ message: "Login successful", token });
  } catch (err) {
    console.error("Error logging in:", err);
    return res.status(500).json({ message: "Login failed: internal server error", error: err.message || "Internal error"});
  }
};
