const Bot = require("../../../domain/Bot");
const Baileys = require("../../../service/Baileys");

var BOT = new Bot(Baileys);

module.exports = (req, res, next) => {
  req.bot = BOT;

  Object.defineProperty(req, "bot", {
    get: () => BOT,
    set: (value) => (BOT = value),
  });

  return next();
};
