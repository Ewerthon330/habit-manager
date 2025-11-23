import { db } from "../config/firebase";


export const userModel = {
  async getAll() {
    const snapshot = await db.collection("users").get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  async create(data: any) {
    const docRef = await db.collection("users").add(data);
    return { id: docRef.id };
  }
};
