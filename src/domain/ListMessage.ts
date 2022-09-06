import { uuid } from "uuidv4";

import Chat from "../infrastructure/bot/Chat";
import Message from "./Message";

export interface List {
  items: Array<ListItem>;
  title: string;
}

export interface ListItem {
  description?: string;
  id?: string;
  title: string;
}

export default class ListMessage extends Message {
  public list: Array<List> = [];
  public buttonText: string;
  public footer: string;
  public title: string;
  public add?: Function;

  constructor(chat: Chat, title: string, text: string, footer: string, buttonText: string) {
    super(chat, text);

    this.title = title;
    this.text = text;
    this.footer = footer;
    this.buttonText = buttonText;
  }

  /**
   * * Adiciona uma seção
   * @param title
   * @param items
   * @returns
   */
  addCategory(title: string, items: Array<ListItem> = []): number {
    const index = this.list.length;

    this.list.push({ title, items });

    return index;
  }

  /**
   * * Adiciona um item a lista
   * @param index
   * @param title
   * @param description
   * @param id
   * @returns
   */
  addItem(index: number, title: string, description: string = "", id: string = this.generateID()) {
    return this.list[index].items.push({ title, description, id });
  }

  public generateID(): string {
    return uuid();
  }
}
