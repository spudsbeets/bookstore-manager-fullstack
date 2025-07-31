import PublishersModel from '../models/PublishersModel.js';

export async function findAll(req, res) {
  try {
    const publishers = await PublishersModel.findAllOrdered();
    res.json(publishers);
  } catch (err) {
    console.error("Error fetching publishers:", err);
    res.status(500).json({ error: 'Failed to fetch publishers' });
  }
}

export async function findOne(req, res) {
  try {
    const publisher = await PublishersModel.findById(req.params.id);
    if (!publisher) return res.status(404).json({ error: 'Publisher not found' });
    res.json(publisher);
  } catch (err) {
    console.error("Error fetching publisher:", err);
    res.status(500).json({ error: 'Failed to fetch publisher' });
  }
}

export async function create(req, res) {
  try {
    const publisher = await PublishersModel.create(req.body);
    res.status(201).json(publisher);
  } catch (err) {
    console.error("Error creating publisher:", err);
    res.status(400).json({ error: 'Failed to create publisher' });
  }
}

export async function update(req, res) {
  try {
    const publisher = await PublishersModel.update(req.params.id, req.body);
    if (!publisher) return res.status(404).json({ error: 'Publisher not found' });
    res.json(publisher);
  } catch (err) {
    console.error("Error updating publisher:", err);
    res.status(400).json({ error: 'Failed to update publisher' });
  }
}

export async function deleteOne(req, res) {
  try {
    const deleted = await PublishersModel.deleteById(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Publisher not found' });
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting publisher:", err);
    res.status(500).json({ error: 'Failed to delete publisher' });
  }
} 