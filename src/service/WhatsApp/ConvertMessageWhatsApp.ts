import { getContentType, MessageUpsertType, proto, WAMessage, WAMessageContent, WAProto } from "@adiwajshing/baileys";
import ListMessage from "../../domain/ListMessage";
import Message from "../../domain/Message";
import ButtonMessage from "../../infrastructure/bot/ButtonMessage";
import Chat from "../../infrastructure/bot/Chat";

export const convertMessage = (message: WAMessage, type?: MessageUpsertType): Message => {
  let msg = new Message(new Chat(""), "");

  if (type) msg.isOld = type !== "notify";

  if (!message.message) return msg;
  if (!message.key.remoteJid) return msg;

  if (message.key.participant) msg.chat.setMember(message.key.participant);
  if (message.key.remoteJid) msg.chat.setId(message.key.remoteJid);
  if (message.key.fromMe) msg.chat.fromMe = message.key.fromMe;
  if (message.pushName) msg.chat.name = message.pushName;
  if (message.key.id) msg.chat.chatID = message.key.id;

  msg = convertContentMessage(message.message, msg);

  return msg;
};

export const convertContentMessage = (messageContent: WAMessageContent, msg: Message): Message => {
  const contentType = getContentType(messageContent);

  if (!contentType) return msg;

  let content: any = contentType === "conversation" ? { text: messageContent[contentType] } : messageContent[contentType];

  if (content.message) return convertContentMessage(content.message, msg);
  if (contentType === "buttonsMessage" || contentType === "templateMessage") msg = convertButtonMessage(messageContent, msg);
  if (!!!msg.text) msg.setText(content.text || content.caption || content.buttonText || content.contentText || content.hydratedTemplate?.hydratedContentText || "");

  if (content.contextInfo) msg = convertContextMessage(content.contextInfo, msg);

  return msg;
};

export const convertContextMessage = (context: proto.ContextInfo, msg: Message): Message => {
  if (context.quotedMessage) {
    const message = {
      key: {
        remoteJid: msg.chat.id,
        participant: context.participant,
        id: context.stanzaId,
      },
      message: context.quotedMessage,
    };

    if (context.mentionedJid) msg.chat.setMembers(context.mentionedJid);

    msg.setMention(convertMessage(message));
  }

  return msg;
};

export const convertButtonMessage = (content: WAMessageContent, msg: Message): Message => {
  let buttonMessage: any = content.buttonsMessage || content.templateMessage;
  const buttonMSG = new ButtonMessage(msg.chat, "");

  if (buttonMessage.hydratedTemplate) buttonMessage = buttonMessage.hydratedTemplate;

  buttonMSG.setText(buttonMessage.contentText || buttonMessage.hydratedContentText || "");
  buttonMSG.setFooter(buttonMessage.footerText || buttonMessage.hydratedFooterText || "");
  buttonMSG.setType(buttonMessage.headerType || buttonMessage.hydratedHeaderType || 1);

  buttonMessage.buttons?.map((button: proto.Message.ButtonsMessage.IButton) => {
    buttonMSG.addReply(button?.buttonText?.displayText || "", button.buttonId || buttonMSG.generateID());
  });

  buttonMessage.hydratedButtons?.map((button: any) => {
    if (button.callButton) buttonMSG.addCall(button.callButton.displayText || "", button.callButton.phoneNumber || buttonMSG.buttons.length);
    if (button.urlButton) buttonMSG.addCall(button.urlButton.displayText || "", button.urlButton.url || "");
    if (button.quickReplyButton) buttonMSG.addCall(button.quickReplyButton.displayText || "", button.quickReplyButton.id);
  });

  return buttonMSG;
};

export const convertListMessage = (content: proto.Message.ListMessage, msg: Message): Message => {
  const listMSG = new ListMessage(msg.chat, "", "", "", "");

  listMSG.setText(content.description);
  listMSG.title = content.title;
  listMSG.footer = content.footerText;
  listMSG.buttonText = content.buttonText;

  content.sections.map((list) => {
    const index = listMSG.list.length;
    listMSG.addCategory(list.title || "");

    list.rows?.map((item) => {
      listMSG.addItem(index, item.title || "", item.description || "", item.rowId || "");
    });
  });

  return listMSG;
};

export default convertMessage;
