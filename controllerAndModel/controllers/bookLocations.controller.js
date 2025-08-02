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
      res.status(400).json({ error: "Failed to create book location" });
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
      res.status(400).json({ error: "Failed to update book location" });
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
