const Response = require('../../../infrastructure/utils/Response');

module.exports = (req, res) => {
  Response.json(res, Response.error(404, "BB001", "Recurso não encontrado!"));
}; 