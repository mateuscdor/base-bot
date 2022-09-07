import logger from "../../../infrastructure/config/logger";
import { DisconnectReason } from "@adiwajshing/baileys";
import Bot from "../../../domain/Bot";

export default async (bot: Bot, update: { action: string; status?: number; login?: any }) => {
  try {
    if (update.action == "open") {
      logger.info("Bot conectado!");
    }

    if (update.action == "close") {
      // Reconexão não requerida
      if (update.status === DisconnectReason.restartRequired) return;
      // Bot Desligado
      if (update.status === DisconnectReason.loggedOut) {
        return logger.warn("Bot desligado!");
      }

      logger.error(`Conexão fechada devido ao erro: ${DisconnectReason[update.status || 500]}`);
    }

    if (update.action == "reconnecting") {
      logger.warn("Reconectando...");
    }
  } catch (err: any) {
    logger.error(`Erro ao atualizar conexão. ${err?.stack || err}`);
  }
};
