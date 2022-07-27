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

    bot.on("connection.update", async (update) => {
      events.connectionUpdate(bot, update);
    });

    bot.on("groups.update", (groupMetadata) =>
      events.groupUpdate(bot, groupMetadata)
    );

    bot.on("group-participants.update", (participants) =>
      events.groupParticipantsUpdate(bot, participants)
    );

    bot.on("groups.upsert", (groupsMetadata) =>
      events.groupsUpsert(bot, groupsMetadata)
    );

    bot.on("chats.set", (chats, isLatest) =>
      events.chatsSet(bot, chats, isLatest)
    );

    bot.on("chats.upsert", (chats) => events.chatsUpsert(bot, chats));

    bot.on("messages.upsert", async (m) => events.messageUpsert(bot, m));

    Response.json(res, Response.result(200));
  } catch (e) {
    logger.error(`Erro construir o bot. ${e.stack}`);

    return Response.json(
      res,
      Response.error(
        404,
        "BB007",
        `Um erro ocorreu ao tentar construir o bot. ${e.stack}`
      )
    );
  }
};
