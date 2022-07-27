const Response = require("../../../infrastructure/utils/Response");

module.exports = (req, res) => {
  Response.json(res, Response.errorDefault("BB002"));
};
