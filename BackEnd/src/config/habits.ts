// firebase/habits.ts
import { db, auth } from '../firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy, Timestamp } from "firebase/firestore";
import { Habit } from "../interfaces/interfaces";

// Adicionar hábito
export const addHabit = async (title: string, frequency: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não está logado");

  const habitsRef = collection(db, "users", user.uid, "habits");

  await addDoc(habitsRef, {
    title,
    frequency,
    createdAt: Timestamp.fromDate(new Date()),
    completedToday: false
  });
};

// Listar hábitos
export const getHabits = async (): Promise<Habit[]> => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não está logado");

  const habitsRef = collection(db, "users", user.uid, "habits");
  const q = query(habitsRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    title: doc.data().title,
    frequency: doc.data().frequency,
    createdAt: doc.data().createdAt.toDate(),
    completedToday: doc.data().completedToday
  }));
};

// Remover hábito
export const removeHabit = async (habitId: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não está logado");

  const habitDoc = doc(db, "users", user.uid, "habits", habitId);
  await deleteDoc(habitDoc);
};

// Marcar hábito como concluído
export const toggleCompleted = async (habitId: string, completed: boolean): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não está logado");

  const habitDoc = doc(db, "users", user.uid, "habits", habitId);
  await updateDoc(habitDoc, { completedToday: completed });
};
