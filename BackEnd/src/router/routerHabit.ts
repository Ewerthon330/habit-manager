import { Router } from "express";
import {
  createHabit,
  listHabits,
  removeHabit,
} from "../controller/habitController";

const routerHabit = Router();

// Criar hábito
routerHabit.post("/users/:userId/habits", createHabit);

// Listar hábitos
routerHabit.get("/users/:userId/habits", listHabits);

// Remover hábito
routerHabit.delete("/users/:userId/habits/:habitId", removeHabit);

export default routerHabit;
