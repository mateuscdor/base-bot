import Chat from "./Chat";

export interface statusOptions {
  typing: string;
  reading: string;
  recording: string;
  online: string;
  offline: string;
}

export default class Status {
  public status: keyof statusOptions;
  public chat?: Chat;
  public id?: string;

  constructor(status: keyof statusOptions, chat?: Chat, id?: string) {
    this.status = status;
    this.chat = chat;
    this.id = id;
  }

  /**
   * * Define o status
   * @param status
   */
  public setStatus(status: keyof statusOptions) {
    this.status = status;
  }

  /**
   * * Define a sala de bate-papo que está com o status
   * @param chat
   */
  public setChat(chat: Chat) {
    this.chat = chat;
  }

  /**
   * * Define o ID da mensagem que está com esse status
   * @param id
   */
  public setId(id: string) {
    this.id = id;
  }

  /**
   * * Retorna o status
   * @returns
   */
  public getStatus(): string {
    return this.status;
  }

  /**
   * * retorna a sala de bate-papo que está com o status
   * @returns
   */
  public getChat(): Chat | undefined {
    return this.chat;
  }

  /**
   * *  Retorna o ID da mensagem que está com esse status
   * @returns 
   */
  public getId(): string | undefined {
    return this.id;
  }
}
