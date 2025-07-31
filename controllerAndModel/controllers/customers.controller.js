import CustomersModel from '../models/CustomersModel.js';

export async function findAll(req, res) {
  try {
    const customers = await CustomersModel.findAll();
    res.json(customers);
  } catch (err) {
    console.error("Error fetching customers:", err);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
}

export async function findOne(req, res) {
  try {
    const customer = await CustomersModel.findById(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    console.error("Error fetching customer:", err);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
}

export async function create(req, res) {
  try {
    const customer = await CustomersModel.create(req.body);
    res.status(201).json(customer);
  } catch (err) {
    console.error("Error creating customer:", err);
    res.status(400).json({ error: 'Failed to create customer' });
  }
}

export async function update(req, res) {
  try {
    const customer = await CustomersModel.update(req.params.id, req.body);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    console.error("Error updating customer:", err);
    res.status(400).json({ error: 'Failed to update customer' });
  }
}

export async function deleteOne(req, res) {
  try {
    const deleted = await CustomersModel.deleteById(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Customer not found' });
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting customer:", err);
    res.status(500).json({ error: 'Failed to delete customer' });
  }
}

export async function findAllForDropdown(req, res) {
  try {
    const customers = await CustomersModel.findAllWithFullName();
    res.json(customers);
  } catch (err) {
    console.error("Error fetching customers for dropdown:", err);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
} 