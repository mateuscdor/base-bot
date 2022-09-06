import Response from "../../../infrastructure/utils/Response";

export default (req: any, res: any) => {
  const { botStatus } = req;

  if (!botStatus) {
    return Response.json(res, Response.error(500, "BB012"));
  }

  Response.json(res, Response.result(200, `BOT UP: ${new Date().toISOString()}`));
};
