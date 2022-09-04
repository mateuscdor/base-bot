import Message from "../../domain/Message";

export default class BaileysMessage {
  private _message: Message;

  public chat: string = "";
  public message: any = {};
  public context: any = {};

  constructor(message: Message) {
    this._message = message;

    this.refactory(this._message);
  }

  refactory(message = this._message) {
    if (message instanceof Message) {
      this.refactoryMessage(message);
    }
  }

  refactoryMessage(message: Message) {
    this.message.text = message.text;

    if (message.mention) this.context.quoted = message.mention;
  }
}
