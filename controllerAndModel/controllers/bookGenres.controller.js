import BookGenresModel from '../models/BookGenresModel.js';

export async function findAll(req, res) {
  try {
    const bookGenres = await BookGenresModel.findAll();
    res.json(bookGenres);
  } catch (err) {
    console.error("Error fetching book genres:", err);
    res.status(500).json({ error: 'Failed to fetch book genres' });
  }
}

export async function findOne(req, res) {
  try {
    const bookGenre = await BookGenresModel.findById(req.params.id);
    if (!bookGenre) return res.status(404).json({ error: 'Book genre not found' });
    res.json(bookGenre);
  } catch (err) {
    console.error("Error fetching book genre:", err);
    res.status(500).json({ error: 'Failed to fetch book genre' });
  }
}

export async function create(req, res) {
  try {
    const bookGenre = await BookGenresModel.create(req.body);
    res.status(201).json(bookGenre);
  } catch (err) {
    console.error("Error creating book genre:", err);
    res.status(400).json({ error: 'Failed to create book genre' });
  }
}

export async function update(req, res) {
  try {
    const bookGenre = await BookGenresModel.update(req.params.id, req.body);
    if (!bookGenre) return res.status(404).json({ error: 'Book genre not found' });
    res.json(bookGenre);
  } catch (err) {
    console.error("Error updating book genre:", err);
    res.status(400).json({ error: 'Failed to update book genre' });
  }
}

export async function deleteOne(req, res) {
  try {
    const deleted = await BookGenresModel.deleteById(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Book genre not found' });
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting book genre:", err);
    res.status(500).json({ error: 'Failed to delete book genre' });
  }
}

export async function findByBookId(req, res) {
  try {
    const bookGenres = await BookGenresModel.findByBookId(req.params.bookId);
    res.json(bookGenres);
  } catch (err) {
    console.error("Error fetching book genres:", err);
    res.status(500).json({ error: 'Failed to fetch book genres' });
  }
}

export async function findByGenreId(req, res) {
  try {
    const bookGenres = await BookGenresModel.findByGenreId(req.params.genreId);
    res.json(bookGenres);
  } catch (err) {
    console.error("Error fetching book genres:", err);
    res.status(500).json({ error: 'Failed to fetch book genres' });
  }
} 