/**
 * @date August 4, 2025
 * @based_on The custom routing architecture designed for this project.
 *
 * @degree_of_originality The routing structure is original work, created to map API endpoints to the corresponding controller functions. It follows standard Express.js routing patterns but is tailored to the specific needs of this application.
 *
 * @source_url N/A - This routing implementation is based on the project's unique requirements.
 *
 * @ai_tool_usage The route files were generated using Cursor, an AI code editor, based on the defined API endpoints and controller structure. The generated code was then reviewed and refined.
 */

import express from "express";
import * as SalesRateLocationsController from "../controllers/salesRateLocations.controller.js";

const salesRateLocationsRouter = express.Router();

salesRateLocationsRouter
   .route("/")
   .get(SalesRateLocationsController.findAll)
   .post(SalesRateLocationsController.create);

salesRateLocationsRouter
   .route("/:id")
   .get(SalesRateLocationsController.findOne)
   .put(SalesRateLocationsController.update)
   .delete(SalesRateLocationsController.deleteOne);

export default salesRateLocationsRouter;
