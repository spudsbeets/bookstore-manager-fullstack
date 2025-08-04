/**
 * @date August 4, 2025
 * @based_on The Node.js project architecture, including the controller and model structure, from the CS 290 course materials.
 *
 * @degree_of_originality The foundational project architecture, which separates concerns into `controllers`, `models`, and `database` modules, is based on the examples and starter code provided in the CS 290 coursework. The specific implementation of each model (e.g., AuthorsModel.js, BooksModel.js) and controller (e.g., authors.controller.js, books.controller.js) to handle the application's unique business logic and database interactions is original work.
 *
 * @source_url The architectural concepts and structure were derived from course modules and examples, similar to those found at https://canvas.oregonstate.edu/courses/1967288/pages/exploration-designing-web-apps-using-mvc-and-rest-api?module_item_id=24465416
 * @ai_tool_usage The controllers were generated using Cursor, an AI code editor. My own controller was provided as a template and schema for the generation, and I subsequently refined the output.
 */

import BookLocationsModel from "../models/BookLocationsModel.js";

export async function findAll(req, res) {
   try {
      const bookLocations = await BookLocationsModel.findAll();
      res.json(bookLocations);
   } catch (err) {
      console.error("Error fetching book locations:", err);
      res.status(500).json({ error: "Failed to fetch book locations" });
   }
}

export async function findOne(req, res) {
   try {
      const bookLocation = await BookLocationsModel.findById(req.params.id);
      if (!bookLocation)
         return res.status(404).json({ error: "Book location not found" });
      res.json(bookLocation);
   } catch (err) {
      console.error("Error fetching book location:", err);
      res.status(500).json({ error: "Failed to fetch book location" });
   }
}

export async function create(req, res) {
   try {
      const bookLocation = await BookLocationsModel.create(req.body);
      res.status(201).json(bookLocation);
   } catch (err) {
      console.error("Error creating book location:", err);

      // Check if it's a duplicate relationship error
      if (err.message.includes("already exists")) {
         res.status(409).json({
            error: "This book is already stored at this location. Please update the existing entry instead of creating a new one.",
            suggestion:
               "Use the edit function to modify the quantity or location.",
         });
      } else {
         res.status(400).json({ error: "Failed to create book location" });
      }
   }
}

export async function update(req, res) {
   try {
      const bookLocation = await BookLocationsModel.update(
         req.params.id,
         req.body
      );
      if (!bookLocation)
         return res.status(404).json({ error: "Book location not found" });
      res.json(bookLocation);
   } catch (err) {
      console.error("Error updating book location:", err);

      // Check if it's a duplicate relationship error
      if (err.message.includes("already exists")) {
         res.status(409).json({
            error: "This book is already stored at the selected location. Please choose a different location or modify the existing entry.",
            suggestion:
               "Select a different storage location or update the existing entry.",
         });
      } else {
         res.status(400).json({ error: "Failed to update book location" });
      }
   }
}

export async function deleteOne(req, res) {
   try {
      const deleted = await BookLocationsModel.deleteById(req.params.id);
      if (!deleted)
         return res.status(404).json({ error: "Book location not found" });
      res.status(204).send();
   } catch (err) {
      console.error("Error deleting book location:", err);
      res.status(500).json({ error: "Failed to delete book location" });
   }
}

export async function findByBookId(req, res) {
   try {
      const bookLocations = await BookLocationsModel.findByBookId(
         req.params.bookId
      );
      res.json(bookLocations);
   } catch (err) {
      console.error("Error fetching book locations:", err);
      res.status(500).json({ error: "Failed to fetch book locations" });
   }
}

export async function findByLocationId(req, res) {
   try {
      const bookLocations = await BookLocationsModel.findByLocationId(
         req.params.locationId
      );
      res.json(bookLocations);
   } catch (err) {
      console.error("Error fetching book locations:", err);
      res.status(500).json({ error: "Failed to fetch book locations" });
   }
}
