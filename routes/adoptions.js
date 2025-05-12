const express = require("express");
const router = express.Router();
const adoptionsController = require("../controllers/adoptionsController");
const { authenticateToken, requireRole } = require("../middlewares/authMiddleware");

// GET /api/adoptions/admin - get all adoption requests (admin)
router.get("/admin", authenticateToken, requireRole("admin"), adoptionsController.getAllAdoptions);

// GET /api/adoptions - get adoption adoption by id user
router.get("/", authenticateToken, adoptionsController.getUserAdoptions);

// POST /api/adoptions - add adoption (user)
router.post("/", authenticateToken, adoptionsController.addAdoption);

// PUT /api/adoptions/admin/:id/status - update status adoption (admin)
router.put("/admin/:id/status", authenticateToken, requireRole("admin"), adoptionsController.updateAdoptionStatus);

// DELETE /api/adoptions/:id - cancel adoption request (user)
router.delete("/:id", authenticateToken, adoptionsController.deleteAdoption);
 
module.exports = router;
