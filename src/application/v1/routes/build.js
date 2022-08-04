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

    bot.onChats.add(async (observer, id, chat, action) => {
      if (action === "remove") {
        // chat removed
      } else if (action === "add") {
        // chat added
      }
    });

    // Definindo evento de conexão
    //? Chamado sempre que a conexão do bot é atualizada (connected, disconnected, etc...)
    bot.on("connection", async (update) => events.connection(bot, update));

    // Definindo evento para novas salas de bate-papo
    bot.on("chats", async (chats) => events.chats(bot, chats));

    // Definindo evento para novas mensagens
    bot.on("messages", async (m) => events.messages(bot, m));

    // Definindo evento para novos grupos
    bot.on("groups", async (groups) => events.groups(bot, groups));

    // Definindo evento para atualização de grupos
    bot.on("groupsUpdate", async (update) => events.groupsUpdate(bot, update));

    // Definindo evento para novos membros
    bot.on("members", async (members) => events.members(bot, members));

    Response.json(res, Response.result(200));
  } catch (e) {
    logger.error(`Erro construir o bot. ${e}`);

    return Response.json(
      res,
      Response.error(
        404,
        "BB007",
        `Um erro ocorreu ao tentar construir o bot. ${e}`
      )
    );
  }
};
