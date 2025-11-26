import { dbAdmin as db } from "../firebase/config";

export interface IHabit {
  id?: string;
  name: string;
  createdAt: number;
}

// Adicionar novo hábito dentro da subcoleção habits do usuário
export const addHabit = async (userId: string, habit: IHabit) => {
  const ref = db
    .collection("users")
    .doc(userId)
    .collection("habits");

  await ref.add({
    name: habit.name,
    createdAt: Date.now(),
  });
};

// Buscar todos os hábitos do usuário
export const getHabits = async (userId: string) => {
  const ref = db
    .collection("users")
    .doc(userId)
    .collection("habits");

  const snapshot = await ref.get();

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  })) as IHabit[];
};

// Remover um hábito específico
export const deleteHabit = async (userId: string, habitId: string) => {
  const ref = db
    .collection("users")
    .doc(userId)
    .collection("habits")
    .doc(habitId);

  await ref.delete();
};

export default {
  addHabit,
  getHabits,
  deleteHabit,
};
