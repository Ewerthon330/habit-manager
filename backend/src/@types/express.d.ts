// Define o formato do payload que você coloca no seu JWT
interface JwtPayload {
    id : number;
    name: string;
    role: string
}

// Usa "declaration merging" para adicionar a propriedade 'user' à interface Request
declare namespace Express {
    export interface Request {
        user?: JwtPayload; // A '?' torna a propriedade opcional
    }
}