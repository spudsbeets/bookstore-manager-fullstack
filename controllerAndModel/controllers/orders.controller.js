import OrdersModel from '../models/OrdersModel.js';

export async function findAll(req, res) {
  try {
    const orders = await OrdersModel.findAll();
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
}

export async function findOne(req, res) {
  try {
    const order = await OrdersModel.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error("Error fetching order:", err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
}

export async function create(req, res) {
  try {
    const order = await OrdersModel.create(req.body);
    res.status(201).json(order);
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(400).json({ error: 'Failed to create order' });
  }
}

export async function update(req, res) {
  try {
    const order = await OrdersModel.update(req.params.id, req.body);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error("Error updating order:", err);
    res.status(400).json({ error: 'Failed to update order' });
  }
}

export async function deleteOne(req, res) {
  try {
    const deleted = await OrdersModel.deleteById(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Order not found' });
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting order:", err);
    res.status(500).json({ error: 'Failed to delete order' });
  }
} 