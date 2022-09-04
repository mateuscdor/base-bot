export interface Chats {
  [key: string]: Chat;
}

export default class Chat {
  public id: string;
  public name: string;
  public isNew: boolean;

  constructor(id: string, name?: string, isNew: boolean = false) {
    this.id = id;
    this.name = name || "";
    this.isNew = isNew;
  }

  setId(id: string) {
    this.id = id;
  }

  setName(name: string) {
    this.name = name;
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }
}
