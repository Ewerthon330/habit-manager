import { Request, Response } from "express";
import userModels from "../models/userModel";
import { hashPassword } from "../services/passwordServices";
import type { IUser } from "../interfaces/interfaces";
import bcrypt from "bcrypt";
import { config } from "dotenv";
config();
const saltRounds = Number(process.env.SALTROUNDS) || 10;
// Criar novo usuário (com senha hasheada corretamente)


const createNewUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Nome, email e senha são obrigatórios." });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const hashedPassword = await bcrypt.hash(String(password), saltRounds);

    const dados = {
      name,
      email: normalizedEmail,
      password: hashedPassword, // <-- important: field must be "password"
      role: role ?? "user",
    };

    const created = await userModels.createNewUser(dados);

    return res.status(201).json({
      message: "Usuário criado com sucesso!",
      user: { id: created.id ?? created._id, name: created.name, email: created.email, role: created.role },
    });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
};

// Buscar todos usuários
const getUserAll = async (req: Request, res: Response) => {
  try {
    const users = await userModels.getUserAll();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
};

// Remover usuário
const removeUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "ID é obrigatório." });
  }

  try {
    await userModels.removeUser(id);
    return res.status(200).json({ message: "Usuário removido com sucesso." });
  } catch (error) {
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
};

export default {
  createNewUser,
  getUserAll,
  removeUser,
};
