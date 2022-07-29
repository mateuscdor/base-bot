require("dotenv/config");

const Response = require("../../../infrastructure/utils/Response");
const events = require("../events");
const logger = require("../../../infrastructure/config/logger");

module.exports = async (req, res) => {
  try {
    const { bot, body } = req;
    const { plataform } = body;

    if (plataform !== "whatsapp") {
      return Response.json(
        res,
        Response.error(404, "BB003", "Plataforma indisponível.")
      );
    }

    await bot.build(`${__dirname}/../../../../auth_info_baileys`);

    logger.info("Bot conectado!");

    bot.onChats.add((observer, id, chat) => {
      // save chats
    });

    bot.on("connection.update", async (update) => {
      events.connectionUpdate(bot, update);
    });

    bot.on("messages.upsert", async (m) => events.messageUpsert(bot, m));

    Response.json(res, Response.result(200));
  } catch (e) {
    logger.error(`Erro construir o bot. ${JSON.stringify(e, "\n", 2)}`);

    return Response.json(
      res,
      Response.error(
        404,
        "BB007",
        `Um erro ocorreu ao tentar construir o bot. ${JSON.stringify(
          e,
          "\n",
          2
        )}`
      )
    );
  }
};
