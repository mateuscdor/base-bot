const logger = require("../../../infrastructure/config/logger");
const Response = require("../../../infrastructure/utils/Response");

module.exports = (req, res, next) => {
  const { botStatus } = req;

  // Verificando se bot está conectado
  if (!botStatus) {
    logger.error(`DOWN: ${new Date().toISOString()}`);
    return Response.json(res, Response.errorDefault("BB011"));
  }

  return next();
};
