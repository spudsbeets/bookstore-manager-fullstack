import express from "express";
import {
   findAll,
   findOne,
   create,
   update,
   deleteOne,
   findByBookId,
   findByLocationId,
} from "../controllers/bookLocations.controller.js";

const router = express.Router();

// GET all book locations
router.get("/", findAll);

// GET book location by ID
router.get("/:id", findOne);

// POST create new book location
router.post("/", create);

// PUT update book location
router.put("/:id", update);

// DELETE book location
router.delete("/:id", deleteOne);

// GET book locations by book ID
router.get("/book/:bookId", findByBookId);

// GET book locations by location ID
router.get("/location/:locationId", findByLocationId);

export default router;
