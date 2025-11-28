import { Request, Response } from "express";

const SYSTEM_INSTRUCTION = {
    role: "user",
    parts: [{
        text: `You are HabiBot, a specialized AI assistant for the 'Health Time' system. 
        Your core function is to provide expert guidance on habit management, health, and productivity
        
        Rules of behavior:
        1. Language: You must always respond in Brazilian Portuguese.
        2. Persona: Your persona must be consistently motivating, friendly, empathetic, and practical.
        3. Response Style: All advice must be concise and actionable. Prioritize short, clear tips that the user can implement immediately.
        4. Scope Enforcement: Your operational scope is strictly limited to topics concerning habits, routines, health, and productivity. If a user query falls outside this domain (e.g., politics, advanced coding, complex mathematics), you must execute the following protocol:
            - Respond with the exact phrase: "Desculpe, sou o HabiBot e posso ajudar apenas com seus hábitos e rotina saudável."
            - Immediately pivot the conversation back to a relevant topic, for example: "Falando de rotinas, como foi seu hábito matinal hoje?"
        5. Tone Modulation: To maintain a light and engaging conversational tone, use emojis sparingly and contextually. Do not overuse them.`
    }]
};

const chatWithGemini = async (req: Request, res: Response) => {
    const { contents } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
        console.error("GEMINI_API_KEY não configurada no .env");
        return res.status(500).json({ message: "Erro de configuração no servidor." });
    }

    if (!contents || !Array.isArray(contents)) {
        return res.status(400).json({ message: "Conteúdo da mensagem é obrigatório e deve ser um array." });
    }

    // Adiciona o System Prompt no início do histórico
    const fullHistory = [SYSTEM_INSTRUCTION, ...contents];

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: fullHistory }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Erro na API do Gemini:", data);
            throw new Error(data.error?.message || "Erro na API do Gemini");
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error("Erro no Chat Controller:", error);
        return res.status(500).json({ message: "O HabiBot está um pouco confuso agora. Tente novamente em instantes." });
    }
};

export default {
    chatWithGemini,
};
