const routes = require("express").Router();

const { bot } = require("./../middlewares/middlewares");

const build = require("./build");
const health = require("./health");

const notFound = require("./not-found");
const internalError = require("./internal-error");

const sendMessage = require("./send-message");

routes.get("/health", health);
routes.get("/notFound", notFound);
routes.get("/internalError", internalError);

routes.post("/build", bot, build);
routes.post("/sendMessage", bot, sendMessage);

module.exports = routes;
