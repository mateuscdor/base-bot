import Bot from "../../../domain/Bot";
import Commands from "../../../domain/Commands";
import WhatsAppBot from "../../../service/WhatsApp/WhatsAppBot";

var BOT = new Bot(new WhatsAppBot(), new Commands(`${__dirname}/../../../infrastructure/commands`));

export default (req: any, res: any, next: Function) => {
  req.bot = BOT;

  Object.defineProperty(req, "bot", {
    get: () => BOT,
    set: (value) => (BOT = value),
  });

  return next();
};
