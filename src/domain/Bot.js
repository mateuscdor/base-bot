const Commands = require("../infrastructure/utils/Commands");
const Observer = require("../infrastructure/utils/Observer");
const logger = require("../infrastructure/config/logger");

class Bot {
  constructor(Plataform) {
    this.plataform = new Plataform();
    this.isConnected = false;
    this.commands = new Commands(`${__dirname}/../infrastructure/commands`);
    this.messages = new Observer();
    this.user = {};
    this.chats = {};
  }

  /**
   * * Definir salas de bate-papo
   * @param {Object} chats
   */
  setChats(chats = {}) {
    this.chats = chats;
  }

  /**
   * * Definir se bot está conectado
   * @param {Boolean} isConnected
   */
  setConnected(isConnected = false) {
    this.isConnected = isConnected;
  }

  /**
   * * Definir usuário
   * @param {Object} user
   */
  setUser(user = {}) {
    this.user = user;
    this.user.id = user.id.replace(/:(.*)@/, "@");
  }

  /**
   * * Construir bot
   * @param {String} authPath
   * @param {Object} config
   */
  async build(authPath, config) {
    await this.plataform.connect(authPath, config);
    this.on = this.plataform.on;

    // Definindo status de conexão
    this.plataform.on("connection.update", async (update) => {
      if (update.connection == "open") {
        this.isConnected = true;
        this.setUser(this.plataform.sock.user);
      } else if (update.connection === "close") {
        this.isConnected = false;
      }
    });
  }

  /**
   * * Reconecta o bot com uma nova configuração
   * @param {Object} config
   * @returns
   */
  async reconnect(config) {
    return await this.plataform.reconnect(config);
  }

  /**
   * * Ler mensagens de uma sala de bate-papo
   * @param {Object} chat
   * @returns
   */
  async readMessages(chat) {
    return await this.plataform.readMessages(chat);
  }

  /**
   * * Definir status do bot
   * @param {String} status
   * @param {Array} chat
   * @returns
   */
  async setStatus(status = "", chat = []) {
    return await this.plataform.setStatus(status, chat);
  }

  /**
   * * Envia a mensagem para a plataforma do bot
   * @param {Object} message
   * @returns
   */
  async send(message) {
    const m = await this.plataform.sendMessage(message);

    logger.info(`Mensagem enviada para: ${m.key.remoteJid}`);

    return m;
  }

  /**
   * * Adiciona a mensagem há uma lista de mensagens para serem enviadas
   * @param {Object} message
   * @param {Number} interval
   * @returns
   */
  async addMessage(message = {}, interval = 1000) {
    return new Promise((resolve, reject) => {
      const msg = async (index, observer) => {
        try {
          if (index == this.messages.get().indexOf(observer)) {
            await this.await(interval);

            await this.send(message);

            this.messages.remove(observer);
            resolve();
          }
        } catch (e) {
          reject(e);
        }
      };

      this.messages.add(msg);

      const messageIndex = this.messages.get().indexOf(msg);
      if (messageIndex === 0) {
        this.messages.notify(messageIndex);
      }
    });
  }

  /**
   * * Envia uma mensagem
   * @param {Object} message
   * @param {Number} interval
   * @param {Number} time
   * @returns
   */
  async sendMessage(message = {}, interval = 1000, time = 1000) {
    await this.await(time);
    await this.plataform.setStatus("sending", message.chat);
    return await this.addMessage(message, interval);
  }

  /**
   * * Cria um tempo de espera
   * @param {Number} timeout
   * @returns
   */
  async await(timeout = 1000) {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  }
}

module.exports = Bot;
