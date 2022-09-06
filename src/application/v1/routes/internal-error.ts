import Response from "../../../infrastructure/utils/Response";

export default (req: any, res: any) => {
  Response.json(res, Response.errorDefault("BB002"));
};
