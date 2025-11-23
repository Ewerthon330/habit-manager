// controllers/habitController.ts
import { Request, Response } from "express";
import habitModels from "../models/habitModels"; // ajuste o caminho conforme seu projeto
import { IHabit } from "../models/habitModels"; // caso exporte a interface, senão remova

// Helper para obter userId (tenta várias fontes)
function getUserIdFromReq(req: Request): string | null {
  // muitos middlewares de auth colocam o user em req.user
  // @ts-ignore
  const uidFromReqUser = (req as any).user?.uid ?? (req as any).user?.id;
  const uidFromParams = req.params.userId;
  const uidFromBody = req.body?.userId;

  return (uidFromReqUser as string) || (uidFromParams as string) || (uidFromBody as string) || null;
}

// POST /users/:userId/habits   OR body: { userId, name }
export const createHabit = async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromReq(req);
    if (!userId) return res.status(401).json({ message: "Usuário não autenticado (userId não encontrado)" });

    const { name } = req.body;
    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "Campo 'name' é obrigatório e precisa ser string." });
    }

    const habit: IHabit = {
      name,
      createdAt: Date.now(),
    };

    await habitModels.addHabit(userId, habit);

    return res.status(201).json({ message: "Hábito criado com sucesso." });
  } catch (error: any) {
    console.error("createHabit error:", error);
    return res.status(500).json({ message: "Erro ao criar hábito.", error: error.message || error });
  }
};

// GET /users/:userId/habits
export const listHabits = async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromReq(req);
    if (!userId) return res.status(401).json({ message: "Usuário não autenticado (userId não encontrado)" });

    const habits = await habitModels.getHabits(userId);
    return res.status(200).json(habits);
  } catch (error: any) {
    console.error("listHabits error:", error);
    return res.status(500).json({ message: "Erro ao buscar hábitos.", error: error.message || error });
  }
};

// DELETE /users/:userId/habits/:habitId
export const removeHabit = async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromReq(req);
    if (!userId) return res.status(401).json({ message: "Usuário não autenticado (userId não encontrado)" });

    const { habitId } = req.params;
    if (!habitId) return res.status(400).json({ message: "Parâmetro 'habitId' é obrigatório." });

    await habitModels.deleteHabit(userId, habitId);
    return res.status(200).json({ message: "Hábito removido com sucesso." });
  } catch (error: any) {
    console.error("removeHabit error:", error);
    return res.status(500).json({ message: "Erro ao remover hábito.", error: error.message || error });
  }
};
