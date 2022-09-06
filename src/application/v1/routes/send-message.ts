import Response from "../../../infrastructure/utils/Response";
import logger from "../../../infrastructure/config/logger";
import Message from "../../../domain/Message";
import Bot from "../../../domain/Bot";

export default async (req: any, res: any) => {
  try {
    const { bot, body }: { bot: Bot; body: { message: Message } } = req;
    const { message } = body;

    // Enviando mensagem
    await bot.send(message);
  } catch (err: any) {
    logger.error(`Erro ao enviar mensagem. ${err?.stack || err}`);

    Response.json(res, Response.error(500, "BB010", `Erro ao enviar a mensagem. Favor tentar novamente.`));
    return;
  }

  Response.json(res, Response.result(204));
};
