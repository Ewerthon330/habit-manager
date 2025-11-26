import { Request, Response } from "express";
import userModels from "../models/userModels";
import jwtServices from "../services/jwtServices";
import { comparePassword } from "../services/passwordServices";
import type { IUser } from "../interfaces/interfaces";

interface IData {
  id: string;
  name: string;
  role: string;
}

const loginUser = async (req: Request, res: Response) => {

  console.log("DADOS RECEBIDOS NO LOGIN:", req.body);
  const rawEmail = req.body?.email;
  const rawPassword = req.body?.password;

  if (!rawEmail || !rawPassword) {
    return res.status(400).json({ message: "Email e senha são obrigatórios." });
  }

  try {
    // normalize input (minimally) to avoid case-sensitivity issues
    const email = String(rawEmail).trim().toLowerCase();
    const password = String(rawPassword);

    const user = (await userModels.findByEmail(email)) as IUser | null;

    // Se não encontrou usuário ou usuário não tem senha -> credenciais inválidas
    if (!user || !user.password) {

      console.log("LOGIN FALHOU: Credenciais inválidas");

      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    const validatePassword = await comparePassword(password, user.password);

    // Não logar senha nem hash em produção -- removidos logs sensíveis
    if (!validatePassword) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    const data: IData = {
      id: String(user.id),
      name: user.name ?? "",
      role: user.role ?? "user",
    };

    const token = jwtServices.sign(data);

    return res.status(200).json({ token });
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
};

export default {
  loginUser,
};
