const isBase64 = require("is-base64");

class Message {
  /**
   * CRia uma mensagem
   * @param {String} chat
   * @param {String} text
   * @param {Message} mention
   */
  constructor(chat, text, mention) {
    this.chat = chat;
    this.text = text;
    this.mention = mention;
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

    if (isBase64(image)) image = this.getBufferToBase64(image);

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

    if (isBase64(video)) video = this.getBufferToBase64(video);

    this.video = video;
    return this;
  }

  /**
   * * Retorna o buffer de um buffer base64
   * @param {Buffer} buffer
   * @returns
   */
  getBufferToBase64(buffer) {
    return Buffer.from(buffer, "base64");
  }
}

module.exports = Message;
