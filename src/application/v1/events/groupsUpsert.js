const logger = require("../../../infrastructure/config/logger");

module.exports = async (bot, groupsMetadata) => {
  return Promise.all(
    groupsMetadata.map(async (chat) => {
      try {
        console.log("group", chat);
        // update chats
      } catch (e) {
        logger.error(`Erro ao ler novo grupo. ${e.stack}`);
      }
    })
  );
};
