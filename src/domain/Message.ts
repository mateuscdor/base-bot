import BaseMessage from "../infrastructure/bot/BaseMessage";
import Chat from "../infrastructure/bot/Chat";

export default class Message implements BaseMessage {
  public chat: Chat;
  public text: string;
  public mention: any;
  public isOld: boolean;

  constructor(chat: Chat, text: string, mention?: any, isOld: boolean = false) {
    this.text = text;
    this.chat = chat;
    this.mention = mention;
    this.isOld = isOld;
  }

  /**
   * * Define a sala de bate-papo
   * @param chat
   */
  setChat(chat: Chat) {
    this.chat = chat;
  }

  /**
   * * Define o texto da mensagem
   * @param text
   * @returns
   */
  setText(text: string) {
    this.text = text;
  }

  /**
   * * Menciona uma mensagem
   * @param mention
   * @returns
   */
  setMention(mention: any) {
    this.mention = mention;
  }

  /**
   * * Obter a sala de bate-papo da mensagem
   * @returns
   */
  getChat(): Chat {
    return this.chat;
  }

  /**
   * * Obter o texto da mensagem
   * @returns
   */
  getText(): string {
    return this.text;
  }

  /**
   * * Obter a menção da mensagemf
   * @returns
   */
  getMention(): any {
    return this.mention;
  }
}
