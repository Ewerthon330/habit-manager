import express from 'express'
import userController from '../controllers/user.controller'
import userModels from '../models/user.model'

export const routerUser = express.Router()

// Buscar por email — agora 100% funcional
routerUser.get('/email/:email', async (req, res) => {
    const { email } = req.params;

    const user = await userModels.findByEmail(email);

    return res.json(user);
});

// Listar todos
routerUser.get('/', userController.getUserAll);

// Criar novo usuário
routerUser.post('/', userController.createNewUser);

// Remover usuário
routerUser.delete('/:id', userController.removeUser);
