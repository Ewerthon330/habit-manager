import express from 'express'
import cors from 'cors'
import { routerUser } from './routes/user.routes'
import { routerAuth } from './routes/auth.routes'
import testRoutes from "./routes/test.routes"
import routerHabit from './routes/habit.routes'

import { routerChat } from './routes/chat.routes'

export const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/user', routerUser)
app.use('/api/auth', routerAuth)
app.use('/api/habit', routerHabit)
app.use('/api/chat', routerChat)
app.use(testRoutes)