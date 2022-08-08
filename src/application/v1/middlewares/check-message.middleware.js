const Message = require("../../../domain/Message");
const Response = require("../../../infrastructure/utils/Response");

module.exports = (req, res, next) => {
  const { body } = req;
  const { message } = body;

  // Verificando se contem mensagem
  if (!!!message) {
    return Response.json(res, Response.error(400, "BB019", "Campo mensagem não foi definido;"));
  }

  // Obtendo valores da mensagem
  const { type, chat, mention, text, image, video, time } = message;

  // Verificando se contem um tipo
  if (!!!type) {
    return Response.json(res, Response.error(400, "BB020", "Campo tipo não foi definido."));
  }

  let msg = message;

  // Criando e validando mensagem do tipo texto
  if (type == "text") {
    msg = new Message(chat, text, mention, image, video, time);

    const checkMessage = msg.valid();
    if (checkMessage.status !== 200) {
      return Response.json(res, checkMessage);
    }
  }

  //? Redifinindo mensagem na requisição
  req.body.message = msg;

  return next();
};
