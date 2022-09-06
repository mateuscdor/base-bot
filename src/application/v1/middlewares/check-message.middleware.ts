import Response from "../../../infrastructure/utils/Response";

export default (req: any, res: any, next: Function) => {
  const { body } = req;
  const { message } = body;

  // Verificando se contem mensagem
  if (!!!message) {
    return Response.json(res, Response.error(400, "BB019", "Campo mensagem não foi definido;"));
  }

  return next();
};
