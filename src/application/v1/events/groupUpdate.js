const logger = require("../../../infrastructure/config/logger");

module.exports = async (bot, [groupMetadata] = data) => {
  try {
    const chat = {
      ...((await bot.plataform.sock.groupMetadata(groupMetadata.id)) || {}),
      ...groupMetadata,
    };

    // update chat
  } catch (e) {
    logger.error(`Erro ao atualizar grupo. ${e.stack}`);
  }
};
