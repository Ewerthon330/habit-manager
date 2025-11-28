import { Router } from "express";
import {
  createHabit,
  listHabits,
  removeHabit,
  toggleCompletion,
} from "../controllers/habitController";

const routerHabit = Router();

// Criar hábito
routerHabit.post("/users/:userId/habits", createHabit);

// Listar hábitos
routerHabit.get("/users/:userId/habits", listHabits);

// Remover hábito
routerHabit.delete("/users/:userId/habits/:habitId", removeHabit);

// Toggle hábito
routerHabit.patch("/users/:userId/habits/:habitId/toggle", toggleCompletion);

export default routerHabit;
