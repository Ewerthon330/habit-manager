// src/models/userModels.ts
import { db } from "../config/firebase";
import type { IUser } from "../interfaces/interfaces";

const COLLECTION = "users";

export default {
  async getUserAll(): Promise<IUser[]> {
    const snapshot = await db.collection(COLLECTION).get();
    return snapshot.docs.map(doc => {
      const data = doc.data() as Partial<IUser>;
      return { id: doc.id, ...data } as IUser;
    });
  },

  async findByEmail(email: string) {
    const snapshot = await db.collection("users")
      .where("email", "==", email)
      .get();

    const doc = snapshot.docs[0];

    if (!doc) return null;

    return { id: doc.id, ...doc.data() };
  },

  async createNewUser(data: Partial<IUser>): Promise<IUser> {
    const docRef = await db.collection(COLLECTION).add({
      ...data
    });
    console.log('model ',docRef)
    return { id: docRef.id, ...data } as IUser;
  },

  async removeUser(id: string): Promise<void> {
    await db.collection(COLLECTION).doc(id).delete();
  },
};
