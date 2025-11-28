import { app } from "./app"
import { config } from 'dotenv'
config()

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta: ${PORT}`)
});

// Keep process alive (fix for clean exit issue)
setInterval(() => { }, 1000 * 60 * 60);