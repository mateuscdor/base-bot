export interface Chats {
  [key: string]: Chat;
}

export default class Chat {
  public members: string[] | Array<string> = [];
  public fromMe?: boolean;
  public member?: string;
  public chatID?: string;
  public isNew?: boolean;
  public name?: string;
  public id: string;

  constructor(id: string, name?: string, isNew?: boolean) {
    this.id = id;
    if (name) this.name = name;
    if (isNew) this.isNew = isNew;
  }

  public setId(id: string) {
    this.id = id;
  }

  public setName(name: string) {
    this.name = name;
  }

  public setMember(member: string) {
    this.member = member;
  }

  public setMembers(members: string[] | Array<string>) {
    this.members = members;
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string | undefined {
    return this.name;
  }
}
