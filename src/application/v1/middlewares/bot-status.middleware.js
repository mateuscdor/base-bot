module.exports = (req, res, next) => {
  const { bot } = req;

  Object.defineProperty(req, "botStatus", {
    get: () => bot.isConnected,
  });

  return next();
};
