import ListMessage from "../../domain/ListMessage";
import Message from "../../domain/Message";
import ButtonMessage from "../../infrastructure/bot/ButtonMessage";
import WhatsAppBot from "./WhatsAppBot";

export default class BaileysMessage {
  private _message: Message;
  private _wa: WhatsAppBot;

  public chat: string = "";
  public message: any = {};
  public context: any = {};
  public relay: boolean = false;

  constructor(wa: WhatsAppBot, message: Message | ButtonMessage) {
    this._wa = wa;
    this._message = message;
  }

  /**
   * * Refatora a mensagem
   * @param message
   */
  public refactory(message = this._message) {
    this.chat = message.chat.id;
    this.message = this.refactoryMessage(message);

    if (message.mention) {
      const original = message.getOriginalMention();
      if (original) this.context.quoted = original;
      else this.context.quoted = this._wa.store.messages[message.mention.chat.id]?.get(message.mention.id);
    }
    if (message instanceof ButtonMessage) this.refactoryButtonMessage(message);
    if (message instanceof ListMessage) this.refactoryListMessage(message);
  }

  public refactoryMessage(message: Message): any {
    const msg: any = {};

    msg.text = message.text;

    if (message.member) msg.participant = message.member;
    if (message.fromMe) msg.fromMe = message.fromMe;
    if (message.id) msg.id = message.id;
    if (message.mentions) msg.mentions = message.mentions;

    return msg;
  }

  /**
   * * Refatora uma mensagem de botão
   * @param message
   */
  public refactoryButtonMessage(message: ButtonMessage) {
    this.relay = true;

    const hydratedTemplate: any = {
      hydratedContentText: message.text,
      hydratedFooterText: message.footer,
      hydratedButtons: [],
    };

    message.buttons.map((button) => {
      const btn: any = {};
      btn.index = button.index;

      if (button.reply) btn.quickReplyButton = { displayText: button.reply.text, id: button.reply.id };
      if (button.call) btn.callButton = { displayText: button.call.text, phoneNumber: button.call.phone };
      if (button.url) btn.urlButton = { displayText: button.url.text, phoneNumber: button.url.url };

      hydratedTemplate.hydratedButtons.push(btn);
    });

    //? A API do WhatsApp está com problemas na mensagem de template
    //! TODO: Arrumar sistema de mensagem template
    this.message = {
      viewOnceMessage: {
        message: {
          templateMessage: {
            hydratedTemplate,
          },
        },
      },
    };
  }

  /**
   * * Refatora uma mensagem de lista
   * @param message
   */
  public refactoryListMessage(message: ListMessage) {
    this.message.buttonText = message.buttonText;
    this.message.description = message.text;
    this.message.footer = message.footer;
    this.message.title = message.title;
    this.message.sections = [];

    message.list.map((list) => {
      const rows: Array<any> = [];

      list.items.map((item) => {
        rows.push({ title: item.title, description: item.description, rowId: item.id });
      });

      this.message.sections.push({ title: list.title, rows });
    });
  }
}
