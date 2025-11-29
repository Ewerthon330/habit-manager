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
      return res.status(400).json({ message: "Por favor, forneça nome, email e senha." });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const existingUser = await userModels.findByEmail(normalizedEmail);
    if (existingUser) {
      return res.status(409).json({ message: "Este endereço de email já está em uso." });
    }

    const hashedPassword = await bcrypt.hash(String(password), saltRounds);

    const dados = {
      name,
      email: normalizedEmail,
      password: hashedPassword, // <-- important: field must be "password"
      role: role ?? "user",
    };

    const created = await userModels.createNewUser(dados);

    return res.status(201).json({
      message: "Cadastro realizado com sucesso!",
      user: { id: created.id ?? created._id, name: created.name, email: created.email, role: created.role },
    });
  } catch (error) {
    console.error("[USER CONTROLLER] Erro ao criar usuário:", error);
    return res.status(500).json({ message: "Ocorreu um erro interno no servidor. Tente novamente mais tarde." });
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
