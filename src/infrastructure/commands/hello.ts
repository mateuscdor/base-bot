import { Command } from "../../domain/Commands";
import Message from "../../domain/Message";
import Bot from "../../domain/Bot";

async function execute(bot: Bot, message: Message) {
  await bot.send(new Message(message.chat, "Hello there!", message));
}

const command = new Command("hello");
command.setDescription("Manda um simples Hello");
command.setPermission(["all"]);
command.setCategory(["test"]);
command.setExecute(execute);

export default command;
