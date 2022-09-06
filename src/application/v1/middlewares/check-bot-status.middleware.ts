import Response from "../../../infrastructure/utils/Response";
import logger from "../../../infrastructure/config/logger";

export default (req: any, res: any, next: Function) => {
  const { botStatus } = req;

  // Verificando se bot está conectado
  if (!botStatus) {
    logger.error(`DOWN: ${new Date().toISOString()}`);
    return Response.json(res, Response.errorDefault("BB011"));
  }

  return next();
};
