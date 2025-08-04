import BookGenresModel from "../models/BookGenresModel.js";

export async function findAll(req, res) {
   try {
      const bookGenres = await BookGenresModel.findAll();
      res.json(bookGenres);
   } catch (err) {
      console.error("Error fetching book genres:", err);
      res.status(500).json({ error: "Failed to fetch book genres" });
   }
}

export async function findOne(req, res) {
   try {
      const bookGenre = await BookGenresModel.findById(req.params.id);
      if (!bookGenre)
         return res.status(404).json({ error: "Book genre not found" });
      res.json(bookGenre);
   } catch (err) {
      console.error("Error fetching book genre:", err);
      res.status(500).json({ error: "Failed to fetch book genre" });
   }
}

export async function create(req, res) {
   try {
      const bookGenre = await BookGenresModel.create(req.body);
      res.status(201).json(bookGenre);
   } catch (err) {
      console.error("Error creating book genre:", err);

      // Check if it's a duplicate relationship error
      if (err.message.includes("already exists")) {
         res.status(409).json({
            error: err.message,
            suggestion:
               "This genre is already associated with this book. Please choose a different genre or book.",
         });
      } else {
         res.status(400).json({ error: "Failed to create book genre" });
      }
   }
}

export async function update(req, res) {
   try {
      const bookGenre = await BookGenresModel.update(req.params.id, req.body);
      if (!bookGenre)
         return res.status(404).json({ error: "Book genre not found" });
      res.json(bookGenre);
   } catch (err) {
      console.error("Error updating book genre:", err);
      res.status(400).json({ error: "Failed to update book genre" });
   }
}

export async function deleteOne(req, res) {
   try {
      const deleted = await BookGenresModel.deleteById(req.params.id);
      if (!deleted)
         return res.status(404).json({ error: "Book genre not found" });
      res.status(204).send();
   } catch (err) {
      console.error("Error deleting book genre:", err);
      res.status(500).json({ error: "Failed to delete book genre" });
   }
}

export async function findByBookId(req, res) {
   try {
      const bookGenres = await BookGenresModel.findByBookId(req.params.bookId);
      res.json(bookGenres);
   } catch (err) {
      console.error("Error fetching book genres:", err);
      res.status(500).json({ error: "Failed to fetch book genres" });
   }
}

export async function findByGenreId(req, res) {
   try {
      const bookGenres = await BookGenresModel.findByGenreId(
         req.params.genreId
      );
      res.json(bookGenres);
   } catch (err) {
      console.error("Error fetching book genres:", err);
      res.status(500).json({ error: "Failed to fetch book genres" });
   }
}

export async function getBooksForDropdown(req, res) {
   try {
      const books = await BookGenresModel.getBooksForDropdown();
      res.json(books);
   } catch (err) {
      console.error("Error fetching books for dropdown:", err);
      res.status(500).json({ error: "Failed to fetch books for dropdown" });
   }
}

export async function getGenresForDropdown(req, res) {
   try {
      const genres = await BookGenresModel.getGenresForDropdown();
      res.json(genres);
   } catch (err) {
      console.error("Error fetching genres for dropdown:", err);
      res.status(500).json({ error: "Failed to fetch genres for dropdown" });
   }
}

export async function updateForBook(req, res) {
   try {
      const { bookId } = req.params;
      const { genreIds } = req.body;

      await BookGenresModel.updateForBook(parseInt(bookId), genreIds);
      res.json({ message: "Book genres updated successfully" });
   } catch (err) {
      console.error("Error updating book genres:", err);
      res.status(500).json({ error: "Failed to update book genres" });
   }
}
