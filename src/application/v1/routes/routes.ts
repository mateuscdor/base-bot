import { bot, botStatus, checkBotStatus, checkMessage } from "./../middlewares/middlewares";
import { Router } from "express";

const routes = Router();

// Server
import health from "./health";
import notFound from "./not-found";
import internalError from "./internal-error";

// Bot
import botHealth from "./bot-health";
import build from "./build";
import sendMessage from "./send-message";

// Rotas do servidor
routes.get("/health", health);
routes.get("/notFound", notFound);
routes.get("/internalError", internalError);

// Rotas do Bot
routes.get("/bot-health", bot, botStatus, botHealth);
routes.post("/build", bot, botStatus, build);
routes.post("/sendMessage", bot, botStatus, checkBotStatus, checkMessage, sendMessage);

export default routes;
