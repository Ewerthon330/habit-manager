import { app } from "./app"
import { config } from 'dotenv'
config()

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`[SERVER] Servidor iniciado com sucesso na porta: ${PORT}`)
});

// Keep process alive (fix for clean exit issue)
setInterval(() => { }, 1000 * 60 * 60);