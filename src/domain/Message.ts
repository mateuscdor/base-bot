import BaseMessage from "../infrastructure/bot/BaseMessage";
import Chat from "../infrastructure/bot/Chat";

export default class Message implements BaseMessage {
  private originalMention: any;

  public mentions: string[] = [];
  public mention?: Message;
  public fromMe?: boolean;
  public isOld?: boolean;
  public member?: string;
  public text: string;
  public id?: string;
  public chat: Chat;

  constructor(chat: Chat, text: string, mention?: Message, id?: string) {
    this.text = text;
    this.chat = chat;

    if (mention) this.mention = mention;
    if (id) this.id = id;
  }

  /**
   * * Define a sala de bate-papo
   * @param chat
   */
  public setChat(chat: Chat) {
    this.chat = chat;
  }

  /**
   * * Define o texto da mensagem
   * @param text
   * @returns
   */
  public setText(text: string) {
    this.text = text;
  }

  /**
   * * Menciona uma mensagem
   * @param mention
   * @returns
   */
  public setMention(mention: any) {
    this.mention = mention;
  }

  /**
   * * Define se a mensagem é antiga
   * @param isOld
   */
  public setIsOld(isOld: boolean) {
    this.isOld = isOld;
  }

  /**
   * * Define o ID da mensagem
   * @param id
   */
  public setId(id: string) {
    this.id = id;
  }

  /**
   * * Define se a mensagem foi enviada pelo bot
   * @param fromMe
   */
  public setfromMe(fromMe: boolean) {
    this.fromMe = fromMe;
  }

  /**
   * * Define um membro da mensagem
   * @param member
   */
  public setMember(member: string) {
    this.member = member;
  }

  /**
   * * Define as menções feitas nas mensagens
   * @param mentions
   */
  public setMentions(mentions: string[]) {
    this.mentions = mentions;
  }

  /**
   * * Adiciona um numero a lista de mencionados
   * @param mentionedId
   */
  public addMentioned(mentionedId: string) {
    this.mentions.push(mentionedId);
  }

  /**
   * * Obter a sala de bate-papo da mensagem
   * @returns
   */
  public getChat(): Chat {
    return this.chat;
  }

  /**
   * * Obter o texto da mensagem
   * @returns
   */
  public getText(): string {
    return this.text;
  }

  /**
   * * Obter a menção da mensagem
   * @returns
   */
  public getMention(): Message | undefined {
    return this.mention;
  }

  /**
   * * retorna se a mensagem é antiga
   * @returns
   */
  public getIsOld(): boolean | undefined {
    return this.isOld;
  }

  /**
   * * Retorna o ID da mensagem
   * @returns
   */
  public getId(): string | undefined {
    return this.id;
  }

  /**
   * * retorna se
   * @returns
   */
  public getFromMe(): boolean {
    return this.fromMe || false;
  }

  //? O Baileys (WhatsApp) precisa da menção original para mencionar uma mensagem
  /**
   * * Define uma menção não refactorada
   * @param originalMention
   */
  public setOriginalMention(originalMention: string): void {
    this.originalMention = originalMention;
  }

  /**
   * * Retorna a menção não refatorada
   * @returns
   */
  public getOriginalMention(): any {
    return this.originalMention;
  }
}
