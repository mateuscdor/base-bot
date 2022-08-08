const Message = require("../../domain/Message");

async function execute(bot, message) {
  await bot.sendMessage(new Message(message.key.remoteJid, "Hello there!", message));
}

module.exports = {
  name: "hello",
  description: "Manda um simples Hello",
  category: ["test"],
  permission: ["all"],
  execute,
};
