import logger from "../../../infrastructure/config/logger";
import { Chat } from "@adiwajshing/baileys";
import Bot from "../../../domain/Bot";

export default async (bot: Bot, chats: Array<Chat>) => {
  console.log("chatsEvent:", chats);

  chats.map(async (chat: Chat) => {
    try {
      // update chat
    } catch (err: any) {
      logger.error(`Erro ao ler novo chat. ${err?.stack || err}`);
    }
  });
};
