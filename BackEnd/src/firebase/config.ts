// src/firebase/config.ts
import admin from "firebase-admin";
import fs from "fs";
import path from "path";

// Carrega .env caso não tenha sido carregado ainda
// (se você já chama dotenv.config() antes de importar este arquivo, pode remover isto)
import dotenv from "dotenv";
dotenv.config();

// Caminho para o service account JSON (defina no .env)
const saPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || "";

// Validação mínima
if (!saPath || !fs.existsSync(saPath)) {
  console.error("Firebase Admin: service account JSON não encontrado. Defina FIREBASE_SERVICE_ACCOUNT_PATH no .env e aponte para o arquivo.");
  // não lançar erro imediatamente para facilitar debug, mas você pode lançar se preferir:
  // throw new Error("Service account JSON not found");
}

// Inicializa o Admin SDK (apenas uma vez)
if (!admin.apps.length) {
  if (saPath && fs.existsSync(saPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(saPath, "utf8"));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      // opcional: databaseURL: process.env.FIREBASE_DATABASE_URL
    });
  } else {
    // fallback: tentar inicializar com Application Default Credentials
    try {
      admin.initializeApp();
    } catch (err) {
      console.error("Falha ao inicializar Firebase Admin:", err);
    }
  }
}

// Exporte o admin para uso em outras partes do backend
export const firebaseAdmin = admin;
export const authAdmin = admin.auth();
export const dbAdmin = admin.firestore();
