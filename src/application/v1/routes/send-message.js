const Response = require("../../../infrastructure/utils/Response");
const Message = require("../../../domain/Message");
const logger = require("../../../infrastructure/config/logger");

module.exports = async (req, res) => {
  try {
    const { bot, body } = req;
    const { chat, text, image, video, time } = body;

    if (!bot.isConnected) {
      Response.json(
        res,
        Response.error(400, "BB009", `Bot não está ligado. ${new Date()}`)
      );
      return;
    }

    const message = new Message(chat, text);

    if (image) message.setImage(image);
    else if (video) message.setVideo(video);

    await bot.sendMessage(message, time);
  } catch (e) {
    logger.error(`Erro ao enviar mensagem. ${e.stack}`);
    Response.json(
      res,
      Response.error(
        500,
        "BB010",
        `Erro ao enviar a mensagem. Favor tentar novamente.`
      )
    );
    return;
  }

  Response.json(res, Response.result(200));
};
