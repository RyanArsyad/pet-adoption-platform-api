const { db } = require("../firebase");
const dotenv = require("dotenv");
const Pet = require("../models/petsModel");
dotenv.config();

const petsCollection = process.env.FIRESTORE_COLLECTION_PETS;

exports.getAllPets = async (req, res) => {
  try {
    const snapshot = await db
      .collection(petsCollection)
      .orderBy("createdAt", "desc")
      .get();

    const pets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); //Konversi snapshot.docs menjadi array objek
    return res.status(200).json(pets);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch pets", error: err.message || "Internal error"});
  }
};

exports.getPetById = async (req, res) => {
  const { id } = req.params;

  try {
    const doc = await db.collection(petsCollection).doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Pet not found" });
    }

    return res.status(200).json({ message: "Pet data found", id: doc.id, ...doc.data() });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch pet", error: err.message || "Internal error"});
  }
};

exports.addPet = async (req, res) => {
  const newPet = new Pet(req.body);
  const { name, species, age, description, available } = newPet;

  if (!name || !species || age === undefined || description === undefined || available === undefined) { //undefined jika feild tidak didefinisikan
    return res.status(400).json({ message: "Missing required pet fields" });
  }

  try {
    const docRef = await db.collection(petsCollection).add({ ...newPet });

    return res.status(201).json({ message: "Pet added successfully", id: docRef.id });
  } catch (err) {
    return res.status(500).json({ message: "Failed to add pet", error: err.message || "Internal error"});
  }
};

exports.updatePet = async (req, res) => {
  const { id } = req.params;
  const { name, species, age, description, available } = req.body;

  try {
    const petRef = db.collection(petsCollection).doc(id);
    const doc = await petRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Pet not found" });
    }

    await petRef.update({
      name,
      species,
      age,
      description,
      available,
      updatedAt: new Date().toISOString(),
    });

    return res.status(200).json({ message: "Pet updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to update pet", error: err.message || "Internal error"});
  }
};

exports.deletePet = async (req, res) => {
  const { id } = req.params;

  try {
    const petRef = db.collection(petsCollection).doc(id);
    const doc = await petRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Pet not found" });
    }

    await petRef.delete();
    return res.status(200).json({ message: "Pet deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to delete pet", error: err.message || "Internal error"});
  }
};
