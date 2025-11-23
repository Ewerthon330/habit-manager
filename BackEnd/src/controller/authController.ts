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
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email e senha são obrigatórios." });
  }

  try {
    const user = await userModels.findByEmail(email) as IUser | null;

    // logo após obter o usuário
    console.log(">> login: email recebido:", email);
    console.log(">> login: user encontrado (raw):", user);


    if (!user) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    if (!user.password) {
      // usuário sem senha armazenada — trate conforme sua regra (por exemplo, login só via OAuth)
      console.error("Usuário sem password cadastrado:", user.id);
      return res.status(500).json({ message: "Erro interno no servidor." });
    }

    const validatePassword = await comparePassword(password, user.password);

    console.log(">> login: senha enviada:", password);
    console.log(">> login: hash do usuário:", user?.password);
    console.log(">> login: resultado comparePassword:", validatePassword);

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
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
};

export default {
  loginUser,
};
