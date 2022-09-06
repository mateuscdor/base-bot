import Response from "../../../infrastructure/utils/Response";

export default (req: any, res: any) => {
  Response.json(res, Response.result(200, `UP: ${new Date().toISOString()}`));
};
