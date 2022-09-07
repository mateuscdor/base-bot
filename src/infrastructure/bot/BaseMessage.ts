import Chat from "./Chat";

export default interface Message {
  chat: Chat;
  id?: string;
  text: string;
  isOld?: boolean;
}
