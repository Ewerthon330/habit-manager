import admin from "firebase-admin";
import { config } from "dotenv";
import path from "path";

config();

const serviceAccountPath = path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH!);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountPath),
});

export const db = admin.firestore();
export const auth = admin.auth();
