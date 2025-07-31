import SalesRateLocationsModel from '../models/SalesRateLocationsModel.js';

export async function findAll(req, res) {
  try {
    const salesRates = await SalesRateLocationsModel.findAllWithLocation();
    res.json(salesRates);
  } catch (err) {
    console.error("Error fetching sales rates:", err);
    res.status(500).json({ error: 'Failed to fetch sales rates' });
  }
}

export async function findOne(req, res) {
  try {
    const salesRate = await SalesRateLocationsModel.findById(req.params.id);
    if (!salesRate) return res.status(404).json({ error: 'Sales rate not found' });
    res.json(salesRate);
  } catch (err) {
    console.error("Error fetching sales rate:", err);
    res.status(500).json({ error: 'Failed to fetch sales rate' });
  }
}

export async function create(req, res) {
  try {
    const salesRate = await SalesRateLocationsModel.create(req.body);
    res.status(201).json(salesRate);
  } catch (err) {
    console.error("Error creating sales rate:", err);
    res.status(400).json({ error: 'Failed to create sales rate' });
  }
}

export async function update(req, res) {
  try {
    const salesRate = await SalesRateLocationsModel.update(req.params.id, req.body);
    if (!salesRate) return res.status(404).json({ error: 'Sales rate not found' });
    res.json(salesRate);
  } catch (err) {
    console.error("Error updating sales rate:", err);
    res.status(400).json({ error: 'Failed to update sales rate' });
  }
}

export async function deleteOne(req, res) {
  try {
    const deleted = await SalesRateLocationsModel.deleteById(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Sales rate not found' });
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting sales rate:", err);
    res.status(500).json({ error: 'Failed to delete sales rate' });
  }
} 