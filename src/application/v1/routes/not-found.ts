import Response from "../../../infrastructure/utils/Response";

export default (req: any, res: any) => {
  Response.json(res, Response.error(404, "BB001", "Recurso não encontrado!"));
};
