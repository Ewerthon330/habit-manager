import { Request, Response } from "express";
import { auth } from "../config/firebase";
import userModels from "../models/userModel";
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

    return res.status(200).json({
      token,
      user: {
        id: data.id,
        name: data.name,
        role: data.role
      }
    });
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ message: "Ocorreu um erro inesperado. Nossa equipe já foi notificada." });
  }
};

// NOVA FUNÇÃO PARA LOGIN/CADASTRO COM GOOGLE
const googleSignup = async (req: Request, res: Response) => {
  console.log("📥 DADOS RECEBIDOS NO GOOGLE SIGNUP:", req.body);

  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({
      message: "idToken é obrigatório."
    });
  }

  try {
    // Verificar token com Firebase Admin
    const decodedToken = await auth.verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    if (!email) {
      return res.status(400).json({ message: "Email não encontrado no token." });
    }

    // Normalizar email
    const normalizedEmail = email.trim().toLowerCase();

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
        firebaseUid: uid,
        photoURL: picture || '',
        provider: 'google',
        role: 'user',
        isVerified: true,
        password: '' // Senha vazia pois usa Google
      };

      const newUser = await userModels.createNewUser(newUserData);
      user = newUser as IUser;
    }

    // Gerar token JWT da nossa aplicação
    const data: IData = {
      id: String(user.id),
      name: user.name ?? "",
      role: user.role ?? "user",
    };

    const token = jwtServices.sign(data);

    console.log("✅ Login Google bem-sucedido para:", user.email);

    return res.status(200).json({
      success: true,
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
    return res.status(401).json({
      message: "Token inválido ou expirado."
    });
  }
};

export default {
  loginUser,
  googleSignup
};