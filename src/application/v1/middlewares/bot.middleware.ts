import Bot from "../../../domain/Bot";
import BaileysBot from "../../../service/Baileys/BaileysBot";

var BOT = new Bot(new BaileysBot());

export default (req: any, res: any, next: Function) => {
  req.bot = BOT;

  Object.defineProperty(req, "bot", {
    get: () => BOT,
    set: (value) => (BOT = value),
  });

  return next();
};
