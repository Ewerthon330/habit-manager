import { IJwtPayload } from "../interfaces/interfaces";
import jwtServices from "../services/jwtServices";
import { type Request, type Response, type NextFunction } from "express";

const asAuthRequest = (req: Request) => req as Request & { user?: IJwtPayload };

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(401).json({ message: "Token não fornceido" });
    }

    try {
        const token = authHeader.split(" ")[1];
        const decodedPayload = jwtServices.verify(token) as IJwtPayload;

        if (!decodedPayload || typeof decodedPayload !== "object") {
            return res.status(403).json({ message: "Token inválido" })
        }

        const r = asAuthRequest(req);

        r.user = decodedPayload as any;
        next();

    } catch (err) {
        console.error("Erro na autenticação", err);
        return res.status(403).json({ message: "Token inválido ou expirado" })
    }
};

export const authorize = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const r = asAuthRequest(req);
        if (!r.user || (roles.length && !roles.includes((r.user.role as string) || ""))) {
            return res.status(403).json({ message: "Permissão Negada" })
        }
        next();
    };
};
