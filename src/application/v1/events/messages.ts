import logger from "../../../infrastructure/config/logger";
import Status from "../../../infrastructure/bot/Status";
import Message from "../../../domain/Message";
import Bot from "../../../domain/Bot";

export default async (bot: Bot, message: Message) => {
  try {
    if (message.fromMe) return;

    // Marcar mensagem como visualizada
    await bot.send(new Status("reading", message.chat, message.id));

    logger.info(`Nova mensagem em: ${message.chat.id}`);

    const command = bot.commands.get(message.text.split(/\s+/)[0]);
    
    if (!command) return;

    try {
      // Executando o comando
      command.execute(bot, message);
    } catch (err: any) {
      logger.error(`Erro ao executar comando. ${err?.stack || err}`);
      await bot.send(new Message(message.chat, "Erro executar comando. Favor tentar novamente", message));
    }
  } catch (err: any) {
    logger.error(`Erro ao processar a mensagem. ${err?.stack || err}`);
  }
};
