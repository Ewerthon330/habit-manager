import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

export interface IHabit {
  id?: string;       // ID gerado pelo Firestore
  name: string;      // Nome do hábito
  createdAt: number; // Timestamp
}

// Adicionar novo hábito dentro da subcoleção habits do usuário
export const addHabit = async (userId: string, habit: IHabit) => {
  const ref = collection(db, "users", userId, "habits");
  await addDoc(ref, {
    name: habit.name,
    createdAt: Date.now(),
  });
};

// Buscar todos os hábitos do usuário
export const getHabits = async (userId: string) => {
  const ref = collection(db, "users", userId, "habits");
  const snapshot = await getDocs(ref);

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  })) as IHabit[];
};

// Remover um hábito específico
export const deleteHabit = async (userId: string, habitId: string) => {
  const ref = doc(db, "users", userId, "habits", habitId);
  await deleteDoc(ref);
};

export default {
  addHabit,
  getHabits,
  deleteHabit,
};
