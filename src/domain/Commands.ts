import * as fs from "fs";

export class Command {
  private _executeCallback: Function = () => {};
  private _replyCallback: Function = () => {};

  public permission: Array<string> = [];
  public category: Array<string> = [];
  public description: string;
  public name: string;

  constructor(name: string, description?: string, permission?: Array<string> | string, category?: Array<string> | string, executeCallback?: Function, replyCallback?: Function) {
    this.description = description || "";
    this.name = name;

    this.setExecute(executeCallback || function () {});
    this.setReply(replyCallback || function () {});
    this.setPermission(permission || []);
    this.setCategory(category || []);
  }

  public execute(...args: any): any {
    return this._executeCallback(...args);
  }

  public reply(...args: any): any {
    return this._replyCallback(...args);
  }

  public setExecute(executeCallback: Function) {
    this._executeCallback = executeCallback;
  }

  public setReply(replyCallback: Function) {
    this._replyCallback = replyCallback;
  }

  public setName(name: string) {
    this.name = name;
  }

  public setDescription(description: string) {
    this.description = description;
  }

  public setPermission(permission: Array<string> | string) {
    if (typeof permission === "string") {
      this.permission = [permission];
    }

    if (Array.isArray(permission)) {
      this.permission = permission;
    }
  }

  public setCategory(category: Array<string> | string) {
    if (typeof category === "string") {
      this.category = [category];
    }

    if (Array.isArray(category)) {
      this.category = category;
    }
  }

  public addPermission(permission: Array<string> | string) {
    if (typeof permission === "string") {
      this.permission.push(permission);
    }

    if (Array.isArray(permission)) {
      this.permission.push(...permission);
    }
  }

  public addCategory(category: Array<string> | string) {
    if (typeof category === "string") {
      this.category.push(category);
    }

    if (Array.isArray(category)) {
      this.category.push(...category);
    }
  }

  public getName(): string {
    return this.name;
  }

  public getDescription(): string {
    return this.description;
  }

  public getPermission(): Array<string> {
    return this.permission;
  }

  public getCategory(): Array<string> {
    return this.category;
  }
}

export interface CommandList {
  [key: string]: Command;
}

export default class Commands {
  public commands: CommandList = {};
  public dir: string = "";

  constructor(dir?: string) {
    if (dir) {
      this.update(dir);
    }
  }

  /**
   * * Define um comando
   * @param name
   * @param command
   */
  public setCommand(name: string, command: Command) {
    this.commands[name] = command;
  }

  /**
   * * Define os comandos
   * @param commands
   */
  public setCommands(commands: CommandList) {
    this.commands = commands;
  }

  /**
   * * Atualiza o diretório dos comandos
   * @param dir
   */
  public update(dir: string) {
    this.dir = dir;
    this.setCommands(this.getCommands(dir));
  }

  /**
   * * Retorna os comandos de um diretório
   * @param dir
   * @returns
   */
  public getCommands(dir: string): CommandList {
    var commands: CommandList = {};
    const filenames: String[] = fs.readdirSync(dir);

    filenames.forEach((file) => {
      if (fs.statSync(`${dir}/${file}`).isDirectory()) {
        commands = { ...commands, ...this.getCommands(`${dir}/${file}`) };
      } else {
        const command = require(`${dir}/${file}`)?.default;
        if (command) commands[command.name.toLowerCase().trim()] = command;
      }
    });

    return commands;
  }

  /**
   * * Retorna um comando
   * @param name
   * @returns
   */
  public get(name: string): Command | undefined {
    return this.commands[name.toLowerCase().trim()];
  }
}
