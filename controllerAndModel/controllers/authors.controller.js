import AuthorsModel from '../models/AuthorsModel.js';

export async function findAll(req, res) {
  try {
    const authors = await AuthorsModel.findAll();
    res.json(authors);
  } catch (err) {
    console.error("Error fetching authors:", err);
    res.status(500).json({ error: 'Failed to fetch authors' });
  }
}

export async function findOne(req, res) {
  try {
    const author = await AuthorsModel.findById(req.params.id);
    if (!author) return res.status(404).json({ error: 'Author not found' });
    res.json(author);
  } catch (err) {
    console.error("Error fetching author:", err);
    res.status(500).json({ error: 'Failed to fetch author' });
  }
}

export async function create(req, res) {
  try {
    const author = await AuthorsModel.create(req.body);
    res.status(201).json(author);
  } catch (err) {
    console.error("Error creating author:", err);
    res.status(400).json({ error: 'Failed to create author' });
  }
}

export async function update(req, res) {
  try {
    const author = await AuthorsModel.update(req.params.id, req.body);
    if (!author) return res.status(404).json({ error: 'Author not found' });
    res.json(author);
  } catch (err) {
    console.error("Error updating author:", err);
    res.status(400).json({ error: 'Failed to update author' });
  }
}

export async function deleteOne(req, res) {
  try {
    const deleted = await AuthorsModel.deleteById(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Author not found' });
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting author:", err);
    res.status(500).json({ error: 'Failed to delete author' });
  }
}

export async function findAllForDropdown(req, res) {
  try {
    const authors = await AuthorsModel.findAllWithFullName();
    res.json(authors);
  } catch (err) {
    console.error("Error fetching authors for dropdown:", err);
    res.status(500).json({ error: 'Failed to fetch authors' });
  }
} 