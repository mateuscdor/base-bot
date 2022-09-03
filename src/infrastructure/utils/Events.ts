import { Observable } from "rxjs";

export default interface Events {
  messages: Observable<any>;
  connection: Observable<any>;
  chats: Observable<any>;
}
