import { Router } from "express";
import chatController from "../controllers/chatController";

const routerChat = Router();

routerChat.post("/", chatController.chatWithGemini);

export { routerChat };
