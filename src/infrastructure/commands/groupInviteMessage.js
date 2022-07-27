const Message = require("../../domain/Message");

async function execute(bot, message) {
  await bot.sendMessage(
    new Message(message.key.remoteJid, "Entrando no grupo...").setMention(
      message
    )
  );

  try {
    const type = Object.keys(message.message)[0];
    await bot.plataform.groupAcceptInvite(message.message[type]?.inviteCode);
  } catch (e) {
    await bot.sendMessage(
      new Message(
        message.key.remoteJid,
        "Erro ao entrar no grupo! Por favor tente novamente."
      ).setMention(message)
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
