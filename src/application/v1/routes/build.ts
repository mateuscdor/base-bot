import Response from "../../../infrastructure/utils/Response";
import logger from "../../../infrastructure/config/logger";
import Chat from "../../../infrastructure/bot/Chat";
import Message from "../../../domain/Message";
import Bot from "../../../domain/Bot";
import events from "../events";

export default async (req: any, res: any) => {
  try {
    const { bot, body }: { bot: Bot; body: any } = req;
    const { plataform }: { plataform: string } = body;

    if (plataform !== "whatsapp") {
      return Response.json(res, Response.error(404, "BB003", "Plataforma indisponível."));
    }

    await bot.build(`${__dirname}/../../../../auth_info_baileys`);

    // Definindo evento de conexão
    bot.addEvent("connection", async (update: any) => events.connection(bot, update));

    // Definindo evento para novas salas de bate-papo
    bot.addEvent("chats", async (chats: Array<Chat>) => events.chats(bot, chats));

    // Definindo evento para novas mensagens
    bot.addEvent("messages", async (message: Message) => events.messages(bot, message));
    
    Response.json(res, Response.result(200));
  } catch (err: any) {
    logger.error(`Erro construir o bot. ${err?.stack || err}`);

    return Response.json(res, Response.error(404, "BB007", `Um erro ocorreu ao tentar construir o bot. ${err?.stack || err}`));
  }
};
