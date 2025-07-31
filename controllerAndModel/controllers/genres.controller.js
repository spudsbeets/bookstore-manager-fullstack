import GenresModel from '../models/GenresModel.js';

export async function findAll(req, res) {
  try {
    const genres = await GenresModel.findAllOrdered();
    res.json(genres);
  } catch (err) {
    console.error("Error fetching genres:", err);
    res.status(500).json({ error: 'Failed to fetch genres' });
  }
}

export async function findOne(req, res) {
  try {
    const genre = await GenresModel.findById(req.params.id);
    if (!genre) return res.status(404).json({ error: 'Genre not found' });
    res.json(genre);
  } catch (err) {
    console.error("Error fetching genre:", err);
    res.status(500).json({ error: 'Failed to fetch genre' });
  }
}

export async function create(req, res) {
  try {
    const genre = await GenresModel.create(req.body);
    res.status(201).json(genre);
  } catch (err) {
    console.error("Error creating genre:", err);
    res.status(400).json({ error: 'Failed to create genre' });
  }
}

export async function update(req, res) {
  try {
    const genre = await GenresModel.update(req.params.id, req.body);
    if (!genre) return res.status(404).json({ error: 'Genre not found' });
    res.json(genre);
  } catch (err) {
    console.error("Error updating genre:", err);
    res.status(400).json({ error: 'Failed to update genre' });
  }
}

export async function deleteOne(req, res) {
  try {
    const deleted = await GenresModel.deleteById(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Genre not found' });
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting genre:", err);
    res.status(500).json({ error: 'Failed to delete genre' });
  }
} 