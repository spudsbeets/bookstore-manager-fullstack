import express from 'express';
import * as WelcomeController from '../controllers/welcome.controller.js';

const welcomeRouter = express.Router();

welcomeRouter.route('/').get(WelcomeController.welcome);

export default welcomeRouter; 