import express from 'express';
import authController from '../controllers/authController';
import userController from '../controllers/userController';

export const routerAuth = express.Router();

// Rotas existentes
routerAuth.post('/login', authController.loginUser);
routerAuth.get("/user", userController.getUserAll);

// NOVA ROTA PARA GOOGLE SIGNUP
routerAuth.post('/google-signup', authController.googleSignup);


