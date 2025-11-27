import express from 'express';
import authController from '../controller/authController';
import userController from '../controller/userController';

export const routerAuth = express.Router();

// Rotas existentes
routerAuth.post('/login', authController.loginUser);
routerAuth.get("/user", userController.getUserAll);

// NOVA ROTA PARA GOOGLE SIGNUP
routerAuth.post('/google-signup', authController.googleSignup);