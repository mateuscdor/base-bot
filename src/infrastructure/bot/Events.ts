import { ReplaySubject, Subject } from "rxjs";
import Message from "../../domain/Message";
import Chat from "./Chat";

export let EventsName: "connection" | "messages" | "chats";

export default interface Events {
  messages: Subject<any>;
  connection: Subject<any>;
  chats: Subject<any>;
}
