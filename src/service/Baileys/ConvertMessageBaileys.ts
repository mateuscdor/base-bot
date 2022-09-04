import { getContentType, MessageUpsertType, proto, WAMessage } from "@adiwajshing/baileys";
import Message from "../../domain/Message";
import Chat from "../../infrastructure/bot/Chat";

export const convertMessage = (message: WAMessage, type?: MessageUpsertType): Message => {
  let msg = new Message(new Chat(""), "");

  if (type) msg.isOld = type !== "notify";

  if (!message.message) return msg;
  if (!message.key.remoteJid) return msg;

  const chat = new Chat(message.key.remoteJid, message.pushName || undefined);
  msg.setChat(chat);

  const contentType = getContentType(message.message);

  if (!contentType) return msg;

  const content: any = message.message[contentType];

  msg.setText(contentType === "conversation" ? content : content.text || content.caption || content.buttonText || "");

  if (contentType && contentType !== "conversation") {
    if (content.contextInfo?.quotedMessage) {
      const quoted: any = content.contextInfo;

      const messageQuoted = {
        key: {
          remoteJid: message.key.remoteJid,
          participant: quoted.participant,
          id: quoted.stanzaId,
        },
        message: quoted.quotedMessage,
      };

      msg.setMention(convertMessage(messageQuoted));
    }
  }

  return msg;
};

export default convertMessage;
