import express from 'express'
import authController from '../controller/authController'
import userController from '../controller/userController'

export const routerAuth = express.Router()

routerAuth.post('/', authController.loginUser)

routerAuth.get("/user", userController.getUserAll)