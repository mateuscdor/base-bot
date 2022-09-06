import Bot from "../../../domain/Bot";

export default (req: any, res: any, next: Function) => {
  const { bot }: { bot: Bot } = req;

  Object.defineProperty(req, "botStatus", {
    get: () => bot.getStatus().status === "online",
  });

  return next();
};
