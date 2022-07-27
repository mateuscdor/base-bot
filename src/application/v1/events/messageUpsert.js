const logger = require("../../../infrastructure/config/logger");
const Message = require("../../../domain/Message");
const chatsUpsert = require("./chatsUpsert");

module.exports = async (bot, m = {}) => {
  try {
    if (!m?.messages) return;
    if (m.messages.length <= 0) return;

    const msg = m.messages[0];

    if (!msg.message) return;
    if (msg.key?.remoteJid == "status@broadcast") return;
    if (msg.key.fromMe) return;

    await bot.readMessages([msg.key]);

    if (m.type !== "notify") return;

    const jid = msg.key.remoteJid;

    if (msg.message.senderKeyDistributionMessage) {
      await chatsUpsert(bot, [{ [jid.includes("@g") ? "id" : "jid"]: jid }]);
      delete msg.message.senderKeyDistributionMessage;
    }

    if (msg.message.messageContextInfo) {
      delete msg.message.messageContextInfo;
    }

    const type = Object.keys(msg.message)[0];
    const message = msg.message[type] || {};
    const text =
      type == "conversation" ? message : message.text || message.caption;

    if (!text) return;

    logger.info(`nova mensagem em: ${jid}`);

    await bot.commands.getCommand(type)?.execute(bot, msg);

    const command = bot.commands.getCommand(text.split(":")[0]);

    if (!command) return;

    try {
      if (command.permission.includes("owner")) {
        const owners = ["5515998585090@s.whatsapp.net"]; // admins

        const user = msg.participant || msg.key.participant || jid;

        if (!owners.includes(user)) {
          return await bot.sendMessage(
            new Message(
              jid,
              "Você não tem permissão para executar esse comando!"
            ).setMention(msg)
          );
        }
      } else if (command.permission.includes("bot")) return;

      command.execute(bot, msg);
    } catch (e) {
      logger.error(`erro ao executar comando. ${e.stack}`);
      await bot.sendMessage(
        new Message(
          jid,
          "Erro executar comando. Favor tentar novamente"
        ).setMention(msg)
      );
    }
  } catch (e) {
    logger.error(`erro ao processar a mensagem. ${e.stack}`);
  }
};
