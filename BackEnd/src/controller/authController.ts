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
    const email = String(rawEmail).trim().toLowerCase();
    const password = String(rawPassword);

    const user = (await userModels.findByEmail(email)) as IUser | null;

    if (!user || !user.password) {
      console.log("LOGIN FALHOU: Credenciais inválidas");
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    const validatePassword = await comparePassword(password, user.password);

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

// NOVA FUNÇÃO PARA LOGIN/CADASTRO COM GOOGLE
const googleSignup = async (req: Request, res: Response) => {
  console.log("📥 DADOS RECEBIDOS NO GOOGLE SIGNUP:", req.body);
  
  const { name, email, firebaseUid, photoURL, provider } = req.body;

  // Validações
  if (!email || !firebaseUid) {
    return res.status(400).json({ 
      message: "Email e firebaseUid são obrigatórios." 
    });
  }

  try {
    // Normalizar email (igual ao login normal)
    const normalizedEmail = String(email).trim().toLowerCase();

    // Verificar se usuário já existe
    let user = (await userModels.findByEmail(normalizedEmail)) as IUser | null;

    if (user) {
      console.log("✅ Usuário existente logando via Google:", user.email);

    } else {
      // Criar novo usuário
      console.log("🆕 Criando novo usuário via Google:", normalizedEmail);
      
      const newUserData = {
        name: name || normalizedEmail.split('@')[0],
        email: normalizedEmail,
        firebaseUid: firebaseUid,
        photoURL: photoURL || '',
        provider: provider || 'google',
        role: 'user',
        isVerified: true,
        // Senha vazia pois vai usar apenas Google Auth
        password: '' 
      };

      const newUser = await userModels.createNewUser(newUserData);
      user = newUser as IUser;
    }

    // Gerar token JWT (mesma estrutura do login normal)
    const data: IData = {
      id: String(user.id),
      name: user.name ?? "",
      role: user.role ?? "user",
    };

    const token = jwtServices.sign(data);

    console.log("✅ Login Google bem-sucedido para:", user.email);

    return res.status(200).json({ 
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        photoURL: user.photoURL
      }
    });

  } catch (error) {
    console.error("❌ Erro no Google Signup:", error);
    return res.status(500).json({ 
      message: "Erro interno no servidor." 
    });
  }
};

export default {
  loginUser,
  googleSignup
};