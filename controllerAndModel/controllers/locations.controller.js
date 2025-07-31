import LocationsModel from '../models/LocationsModel.js';

export async function findAll(req, res) {
  try {
    const locations = await LocationsModel.findAllOrdered();
    res.json(locations);
  } catch (err) {
    console.error("Error fetching locations:", err);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
}

export async function findOne(req, res) {
  try {
    const location = await LocationsModel.findById(req.params.id);
    if (!location) return res.status(404).json({ error: 'Location not found' });
    res.json(location);
  } catch (err) {
    console.error("Error fetching location:", err);
    res.status(500).json({ error: 'Failed to fetch location' });
  }
}

export async function create(req, res) {
  try {
    const location = await LocationsModel.create(req.body);
    res.status(201).json(location);
  } catch (err) {
    console.error("Error creating location:", err);
    res.status(400).json({ error: 'Failed to create location' });
  }
}

export async function update(req, res) {
  try {
    const location = await LocationsModel.update(req.params.id, req.body);
    if (!location) return res.status(404).json({ error: 'Location not found' });
    res.json(location);
  } catch (err) {
    console.error("Error updating location:", err);
    res.status(400).json({ error: 'Failed to update location' });
  }
}

export async function deleteOne(req, res) {
  try {
    const deleted = await LocationsModel.deleteById(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Location not found' });
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting location:", err);
    res.status(500).json({ error: 'Failed to delete location' });
  }
} 