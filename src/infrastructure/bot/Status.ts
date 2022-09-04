import Chat from "./Chat";

export interface statusOptions {
  typing: string;
  reading: string;
  recording: string;
  online: string;
  offline: string;
}

export default class Status {
  public status: string;
  public chat: Chat | undefined;

  constructor(status: string, chat?: Chat) {
    this.status = status;
    this.chat = chat;
  }

  public setStatus(status: string) {
    this.status = status;
  }

  public setChat(chat: Chat) {
    this.chat = chat;
  }

  public getStatus(): string {
    return this.status;
  }

  public getChat(): Chat | undefined {
    return this.chat;
  }
}
