const isBase64 = require("is-base64");
const ValidMessage = require("./ValidMessage");

class Message extends ValidMessage {
  /**
   * * Cria uma mensagem
   * @param {String} chat
   * @param {String} text
   * @param {Message} mention
   * @param {Buffer} image
   * @param {Buffer} video
   * @param {Number} time
   *
   */
  constructor(chat, text, mention, image, video, time) {
    super("text", chat, text, mention, image, video, time);
  }

  /**
   * * Define a sala de bate-papo
   * @param {String} chat
   * @returns
   */
  setChat(chat = "") {
    this.chat = chat;
    return this;
  }

  /**
   * * Define o texto da mensagem
   * @param {*} text
   * @returns
   */
  setText(text = "") {
    this.text = text;
    return this;
  }

  /**
   * * Menciona uma mensagem
   * @param {Message} mention
   * @returns
   */
  setMention(mention) {
    this.mention = mention;
    return this;
  }

  /**
   * * Define uma imagem para a mensagem
   * @param {Buffer} image
   * @returns
   */
  setImage(image) {
    if (this.video) delete this.video;

    if (!isBase64(image)) image = Buffer.from(image).toString("base64");

    this.image = image;
    return this;
  }

  /**
   * * Define um vídeo para a mensagem
   * @param {Buffer} image
   * @returns
   */
  setVideo(video) {
    if (this.image) delete this.image;

    if (!isBase64(video)) {
      video = Buffer.from(video).toString("base64");
    }

    this.video = video;
    return this;
  }
}

module.exports = Message;
