// src/services/passwordServices.ts
import bcrypt from "bcrypt";

// Se você prefere carregar .env apenas no entrypoint do app, remova a linha abaixo.
// import { config } from "dotenv";
// config();

const DEFAULT_SALT_ROUNDS = 10;

function getSaltRounds(): number {
  const raw = process.env.SALTROUNDS ?? process.env.SALT_ROUNDS;
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return DEFAULT_SALT_ROUNDS;
  return Math.round(n);
}

export const hashPassword = async (password: string): Promise<string> => {
  const rounds = getSaltRounds();
  try {
    return await bcrypt.hash(password, rounds);
  } catch (err) {
    // opcional: logar e re-lançar para tratamento externo
    console.error("hashPassword error:", err);
    throw err;
  }
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (err) {
    console.error("comparePassword error:", err);
    // retorna false em caso de erro na comparação (mais seguro)
    return false;
  }
};
