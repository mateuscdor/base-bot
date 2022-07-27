const logger = require("../../../infrastructure/config/logger");

module.exports = async (bot, update) => {
  try {
    if (update.participants.includes(bot.user.id)) {
      if (update.action == "remove") {
        // remove chat
      }
      return;
    }

    const groupMetadata = await bot.plataform.sock.groupMetadata(update.id);

    if (groupMetadata) {
      const participants = groupMetadata.participants;

      // update participants
    }
  } catch (e) {
    logger.error(`Erro ao atualizar membros. ${e.stack}`);
  }
};
