import { Observable } from "rxjs";
import Chat from "../infrastructure/utils/Chat";

import Events from "../infrastructure/utils/Events";
import Status from "../infrastructure/utils/Status";

export interface Plataform {
  connect: Function;
  reconnect: Function;
  stop: Function;
  events: Events;
  send: Function;
  chats: Array<Chat>;
  status: Status;
}
