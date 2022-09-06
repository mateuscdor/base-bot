import Bot from "../../../domain/Bot";
import WhatsAppBot from "../../../service/WhatsApp/WhatsAppBot";

var BOT = new Bot(new WhatsAppBot());

export default (req: any, res: any, next: Function) => {
  req.bot = BOT;

  Object.defineProperty(req, "bot", {
    get: () => BOT,
    set: (value) => (BOT = value),
  });

  return next();
};
