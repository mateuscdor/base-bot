const routes = require("express").Router();

const { bot, botStatus, checkBotStatus, checkMessage } = require("./../middlewares/middlewares");

// Server
const health = require("./health");
const notFound = require("./not-found");
const internalError = require("./internal-error");

// Bot
const botHealth = require("./bot-health");
const build = require("./build");
const sendMessage = require("./send-message");

// Rotas do servidor
routes.get("/health", health);
routes.get("/notFound", notFound);
routes.get("/internalError", internalError);

// Rotas do Bot
routes.get("/bot-health", bot, botStatus, botHealth);
routes.post("/build", bot, botStatus, build);
routes.post("/sendMessage", bot, botStatus, checkBotStatus, checkMessage, sendMessage);

module.exports = routes;
