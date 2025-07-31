import express from "express";
import * as SearchController from "../controllers/search.controller.js";

const searchRouter = express.Router();

searchRouter.route("/").get(SearchController.search);

export default searchRouter;
