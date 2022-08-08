const isBase64 = require("is-base64");
const Response = require("../infrastructure/utils/Response");
const regex = require("../infrastructure/utils/regex");

class ValidMessage {
  /**
   * * Cria uma Validação de mensagem
   * @param {String} type
   * @param {String} chat
   * @param {String} text
   * @param {Object} mention
   * @param {Buffer} image
   * @param {Buffer} video
   * @param {Number} time
   */
  constructor(type, chat, text, mention, image, video, time) {
    this.type = type;
    this.chat = chat;
    this.text = text;
    this.mention = mention;
    this.image = image;
    this.video = video;
    this.time = time || 1000;
  }

  /**
   * * Válida a sala de bate-papo
   * @returns
   */
  validChat() {
    if (!!!this.chat) {
      return Response.error(400, "BB013", "Campo sala de bate-papo é obrigatório.");
    }

    // Refatorando ID
    if (!this.chat.includes("@")) {
      this.chat = `${this.chat}@s.whatsapp.net`;
    }

    //? Concertando mensagens quebradas
    this.chat = this.chat.replace("@gus", "@g.us");
    this.chat = this.chat.replace("@swhatsappnet", "@s.whatsapp.net");

    return Response.result(200);
  }

  /**
   * * Válida o texto
   * @returns
   */
  validText() {
    if (type !== "text" || type !== "image" || type !== "video") return;

    if (!!!this.text) {
      return Response.error(400, "BB015", "Campo texto é obrigátorio.");
    }

    return Response.result(200);
  }

  /**
   * * Válida a imagem
   * @returns
   */
  validImage() {
    if (type !== "image") {
      return Response.result(200);
    }

    if (!Buffer.isBuffer(this.image)) {
      this.image = Buffer.from(this.image).toString("base64");
    }

    if (!isBase64(this.image)) {
      return Response.error(400, "BB016", "Imagem inválida");
    }

    return Response.result(200);
  }

  /**
   * * Válida o vídeo
   * @returns
   */
  validVideo() {
    if (type !== "video") {
      return Response.result(200);
    }

    if (!Buffer.isBuffer(this.video)) {
      this.video = Buffer.from(this.video).toString("base64");
    }

    if (!isBase64(this.video)) {
      return Response.error(400, "BB017", "Vídeo inválida");
    }

    return Response.result(200);
  }

  /**
   * * Válida o tempo de espera
   * @returns
   */
  validTime() {
    if (!regex.hasNumber(this.time)) {
      return Response.error(400, "BB018", "Campo tempo está inválido");
    }

    return Response.result(200);
  }

  /**
   * * Válida a mensagem
   * @returns
   */
  valid() {
    const checkChat = this.validChat();
    if (!this.hasResult(this.chat)) return checkChat;

    const checkText = this.validText();
    if (!this.hasResult(this.text)) return checkText;

    const checkImage = this.validImage();
    if (!this.hasResult(this.image)) return checkImage;

    const checkVideo = this.validVideo();
    if (!this.hasResult(this.video)) return checkVideo;

    const checkTime = this.validTime();
    if (!this.hasResult(this.time)) return checkTime;

    return Response.result(200);
  }

  hasResult(check = {}) {
    return check.status === 200;
  }
}

module.exports = ValidMessage;
