const Response = require("../../../infrastructure/utils/Response");
const logger = require("../../../infrastructure/config/logger");

module.exports = async (req, res) => {
  try {
    const { bot, body } = req;
    const { message } = body;

    // Enviando mensagem
    await bot.sendMessage(message);
  } catch (e) {
    logger.error(`Erro ao enviar mensagem. ${e.stack}`);

    Response.json(
      res,
      Response.error(500, "BB010", `Erro ao enviar a mensagem. Favor tentar novamente.`)
    );

    return;
  }

  Response.json(res, Response.result(204));
};
