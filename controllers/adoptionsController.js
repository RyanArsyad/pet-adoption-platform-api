const { db } = require("../firebase");
const dotenv = require("dotenv"); 
const AdoptionRequest = require("../models/adoptionsModel");

dotenv.config();
 
const adoptionsCollection = process.env.FIRESTORE_COLLECTION_ADOPTIONS;
const petsCollection = process.env.FIRESTORE_COLLECTION_PETS;

// Get all adoption requests (admin)
exports.getAllAdoptions = async (req, res) => {
  try {
    const snapshot = await db.collection(adoptionsCollection).get();
    const adoptions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); //Konversi snapshot.docs menjadi array objek

    return res.status(200).json(adoptions);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch adoption requests", error: err.message || "Internal server error"});
  }
};

// Get adoption requests by current user
exports.getUserAdoptions = async (req, res) => {
  try {
    const userId = req.user.id;
    const snapshot = await db
      .collection(adoptionsCollection)
      .where("user_id", "==", userId)
      .get();

    const userAdoptions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return res.status(200).json(userAdoptions);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch your adoption requests", error: err.message || "Internal server error"});
  }
};

// Add new adoption request (user)
exports.addAdoption = async (req, res) => {
  const { pet_id, pet_name, user_email } = req.body;
  const user_id = req.user.id;

  if (!pet_id || !pet_name || !user_email) {
    return res.status(400).json({ message: "Pet ID, pet name, and user email are required" });
  }

  try {
    const adoptionData = new AdoptionRequest({
      user_id,
      user_email,
      pet_id,
      pet_name,
    });

    const docRef = await db.collection(adoptionsCollection).add({ ...adoptionData });

    // Update pet availability
    await db.collection(petsCollection).doc(pet_id).update({ available: false });

    return res.status(201).json({ message: "Adoption request submitted", id: docRef.id, redirectUrl: "/pages/adoption_requests.html"});
  } catch (err) {
    return res.status(500).json({ message: "Failed to submit adoption request", error: err.message || "Internal server error"});
  }
};

// Update adoption status (admin)
exports.updateAdoptionStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const validStatuses = ["approved", "rejected", "pending"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const adoptionRef = db.collection(adoptionsCollection).doc(id);
    const doc = await adoptionRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Adoption request not found" });
    }

    await adoptionRef.update({
      status,
      updatedAt: new Date().toISOString(),
    });

    return res.status(200).json({ message: "Adoption status updated" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to update status", error: err.message || "Internal server error"});
  }
};

// Cancel adoption request (user)
exports.deleteAdoption = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    const docRef = db.collection(adoptionsCollection).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Adoption request not found" });
    }

    const adoption = doc.data();
    if (adoption.user_id !== user_id) {
      return res.status(403).json({ message: "Can only cancel your own adoption request" });
    }

    await docRef.delete();
    return res.status(200).json({ message: "Adoption request cancelled" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to cancel request", error: err.message || "Internal server error"});
  }
};
