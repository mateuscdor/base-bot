import Message from "../../domain/Message";
import Chat from "./Chat";

export interface Button {
  index: number;
  reply?: { text: string; id: string | number };
  call?: { text: string; phone: number };
  url?: { text: string; url: string };
}

export default class ButtonMessage extends Message {
  public buttons: Array<Button> = [];
  public footer: string;
  public type: number;

  constructor(chat: Chat, text: string, footer: string = "", type: number = 1) {
    super(chat, text);

    this.footer = footer;
    this.type = type;
  }

  /**
   * * Define o rodapé da mensagem
   * @param footer
   */
  public setFooter(footer: string) {
    this.footer = footer;
  }

  /**
   * * Define o tipo da mensagem
   * @param type
   */
  public setType(type: number) {
    this.type = type;
  }

  /**
   * * Adiciona um botão com uma url
   * @param text
   * @param url
   * @param index
   * @returns
   */
  addUrl(text: string, url: string, index: number = this.buttons.length + 1): ButtonMessage {
    this.buttons.push({ index, url: { text, url } });
    return this;
  }

  /**
   * * Adiciona um botão com um telefone
   * @param text
   * @param call
   * @param index
   * @returns
   */
  addCall(text: string, phone: number, index: number = this.buttons.length + 1): ButtonMessage {
    this.buttons.push({ index, call: { text, phone } });
    return this;
  }

  /**
   * * Adiciona um botão respondivel
   * @param text
   * @param id
   * @param index
   * @returns
   */
  addReply(text: string, id: string = this.generateID(), index: number = this.buttons.length + 1): ButtonMessage {
    this.buttons.push({ index, reply: { text, id } });
    return this;
  }

  /**
   * * Remove um botão
   * @param index
   */
  public remove(index: number) {
    this.buttons = this.buttons.filter((button: Button) => {
      if (button.index !== index) return button;
    });
  }

  /**
   * * Gera um novo ID
   * @returns
   */
  public generateID(): string {
    return String(this.buttons.length + 1);
  }
}
