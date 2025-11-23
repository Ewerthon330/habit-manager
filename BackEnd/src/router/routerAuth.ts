import express from 'express'
import authController from '../controller/authController'
import router from './test.routes'
import userController from '../controller/userController'

export const routerAuth = express.Router()

routerAuth.post('/', authController.loginUser)

router.get("/users", userController.getUserAll)