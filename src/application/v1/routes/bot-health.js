const Response = require("../../../infrastructure/utils/Response");

module.exports = (req, res) => {
  const { botStatus } = req;

  if (!botStatus) {
    return Response.json(res, Response.error(500, "BB012", down));
  }

  Response.json(res, Response.result(200, `BOT UP: ${new Date().toISOString()}`));
};
