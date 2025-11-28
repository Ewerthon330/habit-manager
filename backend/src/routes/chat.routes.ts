import { Router } from "express";
import chatController from "../controllers/chat.controller";

const routerChat = Router();

routerChat.post("/", chatController.chatWithGemini);

export { routerChat };
