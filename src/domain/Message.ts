const isBase64 = require("is-base64");
const ValidMessage = require("./ValidMessage");
import BaseMessage from "../infrastructure/utils/BaseMessage";

export default class Message extends ValidMessage implements BaseMessage {
  public chat: string;
  public text: string;
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
  constructor(chat: string, text: string, image: Buffer, video: Buffer, mention: any, time: number) {
    super("text", chat, text, mention, image, video, time);

    this.text = text;
    this.chat = chat;
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
  setMention(mention: any) {
    this.mention = mention;
    return this;
  }

  /**
   * * Define uma imagem para a mensagem
   * @param {Buffer} image
   * @returns
   */
  setImage(image: string) {
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
  setVideo(video: string) {
    if (this.image) delete this.image;

    if (!isBase64(video)) {
      video = Buffer.from(video).toString("base64");
    }

    this.video = video;
    return this;
  }
}

module.exports = Message;
