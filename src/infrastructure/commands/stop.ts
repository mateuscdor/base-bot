import { Command } from "../../domain/Commands";
import Message from "../../domain/Message";
import Bot from "../../domain/Bot";
import logger from "../config/logger";
import { DisconnectReason } from "@adiwajshing/baileys";

async function execute(bot: Bot, message: Message) {
  try {
    await bot.send(new Message(message.chat, "Desligando bot...", message));
    logger.info("Desligando Bot...");

    //? Espera 5 segundos para dar um tempo da mensagem ser enviada
    await bot.sleep(5000);

    await bot.get().stop(DisconnectReason.loggedOut);
  } catch (err: any) {
    logger.error(`Erro ao desligar bot. ${err?.stack || err}`);

    await bot.send(new Message(message.chat, "Erro ao desligar bot. Favor tentar novamente", message));
  }
}

const command = new Command("stop");
command.setDescription("Desliga o bot");
command.setPermission(["bot"]);
command.setCategory(["owner"]);
command.setExecute(execute);

export default command;
