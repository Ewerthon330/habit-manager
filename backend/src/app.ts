import express from 'express'
import cors from 'cors'
import { routerUser } from './routes/userRoutes'
import { routerAuth } from './routes/authRoutes'
import testRoutes from "./routes/testRoutes"
import routerHabit from './routes/habitRoutes'

import { routerChat } from './routes/chatRoutes'

export const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/user', routerUser)
app.use('/api/auth', routerAuth)
app.use('/api/habit', routerHabit)
app.use('/api/chat', routerChat)
app.use(testRoutes)