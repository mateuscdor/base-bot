import isBase64 from "is-base64";

import Response, { Schema } from "../infrastructure/utils/Response";
import Message from "./Message";

class ValidMessage {
  private _message: any;

  constructor(message: Message) {
    this._message = message;
  }

  /**
   * * Válida a sala de bate-papo
   * @returns
   */
  validChat(): Schema {
    if (!!!this._message.chat) {
      return Response.error(400, "BB013", "Campo sala de bate-papo é obrigatório.");
    }

    return Response.result(200);
  }

  /**
   * * Válida o texto
   * @returns
   */
  validText(): Schema {
    if (!!!this._message.text) {
      return Response.error(400, "BB015", "Campo texto é obrigátorio.");
    }

    return Response.result(200);
  }

  /**
   * * Válida a imagem
   * @returns
   */
  validImage(): Schema {
    if (!this._message.image) {
      return Response.result(200);
    }

    if (!Buffer.isBuffer(this._message.image)) {
      this._message.image = Buffer.from(this._message.image).toString("base64");
    }

    if (!isBase64(this._message.image)) {
      return Response.error(400, "BB016", "Imagem inválida");
    }

    return Response.result(200);
  }

  /**
   * * Válida o vídeo
   * @returns
   */
  validVideo(): Schema {
    if (!this._message.video) {
      return Response.result(200);
    }

    if (!Buffer.isBuffer(this._message.video)) {
      this._message.video = Buffer.from(this._message.video).toString("base64");
    }

    if (!isBase64(this._message.video)) {
      return Response.error(400, "BB017", "Vídeo inválida");
    }

    return Response.result(200);
  }

  /**
   * * Válida a mensagem
   * @returns
   */
  valid() {
    const checkChat = this.validChat();
    if (!this.hasResult(checkChat)) return checkChat;

    const checkText = this.validText();
    if (!this.hasResult(checkText)) return checkText;

    const checkImage = this.validImage();
    if (!this.hasResult(checkImage)) return checkImage;

    const checkVideo = this.validVideo();
    if (!this.hasResult(checkVideo)) return checkVideo;

    return Response.result(200);
  }

  hasResult(check: Schema) {
    return check.status === 200;
  }
}