const Response = require("../../../infrastructure/utils/Response");

module.exports = (req, res) => {
  Response.json(res, Response.result(200, `UP: ${new Date().toISOString()}`));
};
