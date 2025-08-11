/**
 * @date August 4, 2025
 * @based_on The Node.js project architecture, including the controller and model structure, from the CS 290 course materials.
 *
 * @degree_of_originality The foundational project architecture, which separates concerns into `controllers`, `models`, and `database` modules, is based on the examples and starter code provided in the CS 290 coursework. The specific implementation of each model (e.g., AuthorsModel.js, BooksModel.js) and controller (e.g., authors.controller.js, books.controller.js) to handle the application's unique business logic and database interactions is original work.
 *
 * @source_url The architectural concepts and structure were derived from course modules and examples, similar to those found at https://canvas.oregonstate.edu/courses/1967288/pages/exploration-designing-web-apps-using-mvc-and-rest-api?module_item_id=24465416
 *
 * @ai_tool_usage The controllers were generated using Cursor, an AI code editor. My own controller was provided as a template and schema for the generation, and I subsequently refined the output.
 */

import CustomersModel from "../models/CustomersModel.js";

export async function findAll(req, res) {
   try {
      const customers = await CustomersModel.findAll();
      res.json(customers);
   } catch (err) {
      console.error("Error fetching customers:", err);
      res.status(500).json({ error: "Failed to fetch customers" });
   }
}

export async function findOne(req, res) {
   try {
      const customer = await CustomersModel.findById(req.params.id);
      if (!customer)
         return res.status(404).json({ error: "Customer not found" });
      res.json(customer);
   } catch (err) {
      console.error("Error fetching customer:", err);
      res.status(500).json({ error: "Failed to fetch customer" });
   }
}

export async function create(req, res) {
   try {
      const customer = await CustomersModel.create(req.body);
      res.status(201).json(customer);
   } catch (err) {
      console.error("Error creating customer:", err);
      res.status(400).json({ error: "Failed to create customer" });
   }
}

export async function update(req, res) {
   try {
      const customer = await CustomersModel.update(req.params.id, req.body);
      if (!customer)
         return res.status(404).json({ error: "Customer not found" });
      res.json(customer);
   } catch (err) {
      console.error("Error updating customer:", err);
      res.status(400).json({ error: "Failed to update customer" });
   }
}

export async function deleteOne(req, res) {
   try {
      const result = await CustomersModel.deleteById(req.params.id);
      if (result.success) {
         res.status(200).json({
            message: result.message,
         });
      } else {
         res.status(404).json({ error: "Customer not found" });
      }
   } catch (err) {
      console.error("Error deleting customer:", err);
      res.status(500).json({
         error: "Failed to delete customer",
         details: err.message,
      });
   }
}

export async function findAllForDropdown(req, res) {
   try {
      const customers = await CustomersModel.findAllWithFullName();
      res.json(customers);
   } catch (err) {
      console.error("Error fetching customers for dropdown:", err);
      res.status(500).json({ error: "Failed to fetch customers" });
   }
}
