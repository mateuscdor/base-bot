const bot = require("./bot.middleware");
const botStatus = require("./bot-status.middleware");
const checkBotStatus = require("./check-bot-status.middleware");
const checkMessage = require("./check-message.middleware");

module.exports = { bot, botStatus, checkBotStatus, checkMessage };
