const logger = require("../../../infrastructure/config/logger");

module.exports = async (bot, chats) => {
  return Promise.all(
    chats.map(async (chat) => {
      try {
        // update chat
      } catch (e) {
        logger.error(`Erro ao ler novo chat. ${e.stack}`);
      }
    })
  );
};
