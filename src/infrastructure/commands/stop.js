const Message = require("../../domain/Message");
const logger = require("../config/logger");

async function execute(bot, message) {
  try {
    await bot.sendMessage(
      new Message(message.key.remoteJid, "Desligando bot...")
    );

    //? Espera 5 segundos para dar um tempo da mensagem ser enviada
    await bot.sleep(5000);

    await bot.plataform.stop();
  } catch (e) {
    logger.error(`erro ao desligar bot. ${e}`);

    await bot.sendMessage(
      new Message(
        message.key.remoteJid,
        "Erro ao desligar bot. Favor tentar novamente"
      )
    );
  }
}

module.exports = {
  name: "stop",
  description: "Desliga o bot",
  category: ["bot"],
  permission: ["owner"],
  execute,
};
