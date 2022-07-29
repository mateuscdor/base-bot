const Commands = require("../infrastructure/utils/Commands");
const Observer = require("../infrastructure/utils/Observer");
const logger = require("../infrastructure/config/logger");

class Bot {
  constructor(Plataform) {
    this.plataform = new Plataform();
    this.isConnected = false;
    this.commands = new Commands(`${__dirname}/../infrastructure/commands`);
    this.messages = new Observer();
    this.onChats = new Observer();
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
    const id = user.id.replace(/:(.*)@/, "@");
    this.user = { ...user, id };
  }

  /**
   * * Adiciona uma nova sala de bate-papo
   * @param {Object} chat
   */
  addChat(chat = {}) {
    this.chats[chat.id || chat.jid] = chat;
    this.onChats.notify();
  }

  /**
   * * Definir uma sala de bate-papo
   * @param {String} id
   * @param {Object} chat
   */
  setChat(id = "", chat = {}) {
    this.chats[id] = chat;
    this.onChats.notify();
  }

  /**
   * * Remove uma sala de bate-papo
   * @param {String} id
   */
  removeChat(id = "") {
    delete this.chats[id];
    this.onChats.notify();
  }

  /**
   * * Retorna uma ou todas salas de bate-papo
   * @param {*} id
   * @param {*} isArray
   * @returns
   */
  getChats(id = "") {
    if (!!id) return this.chats[id];
    else return this.chats || {};
  }

  /**
   * * Construir bot
   * @param {String} authPath
   * @param {Object} config
   */
  async build(authPath, config) {
    await this.plataform.connect(authPath, config);
    this.on = this.plataform.on;
    this.isConnected = true;
    this.setUser(this.plataform.sock.user);

    // Definindo status de conexão
    this.plataform.on("connection.update", async (update) => {
      if (update.connection === "close") {
        this.isConnected = true;
        this.setUser(this.plataform.sock.user);
      } else if (update.connection === "close") {
        this.isConnected = false;
      }
    });

    // Definindo novas salas de bate-papo
    this.on("chats.upsert", (chats) => {
      chats.map(async (chat) => {
        this.addChat(chat);
      });
    });

    // Definindo salas de bate-papo
    this.on("messages.upsert", async (m) => {
      const message = m?.messages[0];
      if (!message?.message) return;

      const jid = message.key.remoteJid;

      if (!message.message.senderKeyDistributionMessage) return;
      if (this.chats[jid]) return;

      this.setChat(jid, { jid });
    });

    // Removendo salas de bate-papo
    this.on("group-participants.update", (update) => {
      if (update.action != "remove") return;
      if (!update.participants.includes(this.user.id)) return;

      this.removeChat(update.id);
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
