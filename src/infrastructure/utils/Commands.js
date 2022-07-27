const fs = require("fs");

class Commands {
  constructor(dir) {
    this.commands = {};

    this.update(dir);
  }

  /**
   * * Define um comando
   * @param {String} name
   * @param {Object} command
   */
  setCommand(name = "", command = {}) {
    this.commands[name] = command;
  }

  /**
   * * Define os comandos
   * @param {OBject} commands
   */
  setCommands(commands = {}) {
    this.commands = commands;
  }

  /**
   * * Atualiza o diretório dos comandos
   * @param {String} dir
   */
  update(dir) {
    this.dir = dir;

    this.setCommands(this.getCommands(this.dir));
  }

  /**
   * * Retorna os comandos de um diretório
   * @param {String} dir
   * @returns
   */
  getCommands(dir = this.dir) {
    var commands = {};
    const filenames = fs.readdirSync(dir);

    filenames.forEach((file) => {
      if (fs.statSync(`${dir}/${file}`).isDirectory()) {
        commands = { ...commands, ...this.getCommands(`${dir}/${file}`) };
      } else {
        const command = require(`${dir}/${file}`);
        commands[command.name?.toLowerCase().trim()] = command;
      }
    });

    return commands;
  }

  /**
   * * Retorna um comando
   * @param {String} name
   * @returns
   */
  getCommand(name = "") {
    return this.commands[name.toLowerCase().trim()];
  }
}

module.exports = Commands;
