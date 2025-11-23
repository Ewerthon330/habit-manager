import express from 'express'
import cors from 'cors'
import { routerUser } from './router/routerUser'
import { routerAuth } from './router/routerAuth'
import testRoutes from "./router/test.routes"
import routerHabit from './router/routerHabit'

export const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/user', routerUser)
app.use('/api/login', routerAuth)
app.use('/api/habit', routerHabit)
app.use(testRoutes)