import { db } from "../config/firebase";

export interface IHabit {
  id?: string;
  name: string;
  createdAt: number;
  completedDates?: { [date: string]: boolean }; // Ex: { "2023-11-27": true }
}

// Adicionar novo hábito
export const addHabit = async (userId: string, habit: IHabit) => {
  const ref = db.collection("users").doc(userId).collection("habits");

  await ref.add({
    name: habit.name,
    createdAt: Date.now(),
    completedDates: {}
  });
};

// Buscar hábitos do usuário
export const getHabits = async (userId: string) => {
  const ref = db.collection("users").doc(userId).collection("habits");
  const snapshot = await ref.get();

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  })) as IHabit[];
};

// Toggle de conclusão (Marcar/Desmarcar)
export const toggleHabitCompletion = async (userId: string, habitId: string, date: string, completed: boolean) => {
  const ref = db.collection("users").doc(userId).collection("habits").doc(habitId);

  // Atualiza campo específico no mapa completedDates
  await ref.update({
    [`completedDates.${date}`]: completed
  });
};

// Remover hábito
export const deleteHabit = async (userId: string, habitId: string) => {
  const ref = db.collection("users").doc(userId).collection("habits").doc(habitId);
  await ref.delete();
};

export default {
  addHabit,
  getHabits,
  deleteHabit,
  toggleHabitCompletion
};
