const Message = require("../../domain/Message");

async function execute(bot, message) {
  try {
    await bot.sendMessage(new Message(message.key.remoteJid, "Entrando no grupo...", message));

    const type = Object.keys(message.message)[0];

    await bot.plataform.groupAcceptInvite(message.message[type]?.inviteCode);

    await bot.sendMessage(new Message(message.key.remoteJid, "Entrei no grupo :)", message));
  } catch (e) {
    await bot.sendMessage(
      new Message(
        message.key.remoteJid,
        "Erro ao entrar no grupo! Por favor tente novamente.",
        message
      )
    );
  }
}

module.exports = {
  name: "groupInviteMessage",
  description: "Aceita automaticamente o convite de um grupo",
  category: ["auto"],
  permission: ["bot"],
  execute,
};
