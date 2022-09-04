import Chat from "./Chat";

export default interface Message {
  chat: Chat;
  text: string;
  mention: any;
}
