const logger = require("../../../infrastructure/config/logger");

module.exports = async (bot, update) => {
  return await new Promise(async (resolve, reject) => {
    try {
      const { connection, lastDisconnect } = update;

      if (connection === "close") {
        const status =
          lastDisconnect.error?.output?.statusCode ||
          lastDisconnect.error ||
          500;

        if (status !== bot.plataform.DisconnectReason.restartRequired) {
          const err =
            bot.plataform.DisconnectReason[status] ||
            JSON.stringify(lastDisconnect, "\n", 2);

          logger.error(`Conexao fechada devido ao erro: ${err}`);
        }

        if (status == bot.plataform.DisconnectReason.loggedOut) return;

        logger.warn("Bot desligado.");
      }
    } catch (e) {
      logger.error(`Erro ao atualizar conexão. ${e.stack}`);
    }
  });
};
