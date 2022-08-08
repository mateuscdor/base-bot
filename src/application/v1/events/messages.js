const logger = require("../../../infrastructure/config/logger");
const Message = require("../../../domain/Message");

module.exports = async (bot, m = {}) => {
  try {
    // Verificando se a mensagem é válida
    if (!m?.messages) return;
    if (m.messages.length <= 0) return;

    const msg = m.messages[0];

    // Verificando se é uma mensagem real e se não foi enviada pelo bot
    if (!msg.message) return;
    if (msg.key?.remoteJid == "status@broadcast") return;
    // if (msg.key.fromMe) return;

    // Marcar mensagem como visualizada
    await bot.readMessages([msg.key]);

    // Verificar se não é uma mensagem antiga
    if (m.type !== "notify") return;

    const jid = msg.key.remoteJid;

    // Removendo dados da mensagem
    delete msg.message.senderKeyDistributionMessage;
    delete msg.message.messageContextInfo;

    // Lendo mensagem
    const type = Object.keys(msg.message)[0];
    const message = msg.message[type] || {};
    const text = type == "conversation" ? message : message.text || message.caption;

    if (!text) return;

    logger.info(`nova mensagem em: ${jid}`);

    // Verificando se a mensagem é um comando
    await bot.commands.getCommand(type)?.execute(bot, msg);

    const command = bot.commands.getCommand(text.split(":")[0]);

    if (!command) return;

    try {
      // Verificando se usuário tem permissão de enviar a mensagem
      if (command.permission.includes("owner")) {
        // admins
        const owners = ["15484805741@s.whatsapp.net"];
        const user = msg.participant || msg.key.participant;

        if (!owners.includes(user)) {
          return await bot.sendMessage(
            new Message(jid, "Você não tem permissão para executar esse comando!", msg)
          );
        }
      } else if (command.permission.includes("bot")) return;

      // Executando o comando
      command.execute(bot, msg);
    } catch (e) {
      logger.error(`erro ao executar comando. ${e.stack}`);
      await bot.sendMessage(new Message(jid, "Erro executar comando. Favor tentar novamente", msg));
    }
  } catch (e) {
    logger.error(`erro ao processar a mensagem. ${e.stack}`);
  }
};
