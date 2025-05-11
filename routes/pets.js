const express = require("express");
const router = express.Router();
const petsController = require("../controllers/petsController");
const { authenticateToken, requireRole } = require("../middlewares/authMiddleware");

// GET /api/pets/ - all pets
router.get("/", petsController.getAllPets);

// GET /api/pets/:id - single pet by ID
router.get("/:id", petsController.getPetById);

// POST /api/pets/ - new pet (admin)
router.post("/", authenticateToken, requireRole("admin"), petsController.addPet);

// PUT /api/pets//:id - update pet (admin) 
router.put("/:id", authenticateToken, requireRole("admin"), petsController.updatePet);

// DELETE /api/pets//:id - delete pet (admin)
router.delete("/:id",authenticateToken, requireRole("admin"), petsController.deletePet);

module.exports = router;
