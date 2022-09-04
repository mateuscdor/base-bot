import { BehaviorSubject, ReplaySubject, Subject } from "rxjs";
import Chat, { Chats } from "./Chat";

import Message from "../../domain/Message";
import Events from "./Events";
import Status from "./Status";

export interface BotInterface {
  reconnect: Function;
  connect: Function;
  status: Status;
  stop: Function;
  send: Function;
  chats: Chats;
  user: any;
}

export default class BaseBot implements BotInterface {
  public events: Events = { connection: new BehaviorSubject({}), messages: new Subject(), chats: new Subject() };

  public status: Status = new Status("offline");
  public chats: Chats = {};
  public user: any = {};

  constructor() {
    this.events.chats.subscribe((chat: Chat) => (this.chats[chat.id] = chat));
  }

  public async send(message: Message | Status): Promise<any> {}
  public async connect(auth: any, config?: any): Promise<any> {}
  public async reconnect(config?: any): Promise<any> {}
  public async stop(reason?: any): Promise<any> {}

  /**
   * * Adiciona um evento
   * @param eventName
   * @param event
   */
  addEvent(eventName: "connection" | "messages" | "chats", event: any): void {
    this.events[eventName].subscribe(event);
  }
}
