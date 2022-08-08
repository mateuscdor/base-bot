const Commands = require("../infrastructure/utils/Commands");
const Observer = require("../infrastructure/utils/Observer");
const logger = require("../infrastructure/config/logger");
const Message = require("./Message");
const calculeTime = require("../infrastructure/utils/calculeTime");

class Bot {
  constructor(Plataform) {
    this.plataform = new Plataform();
    this.isConnected = false;
    this.commands = new Commands(`${__dirname}/../infrastructure/commands`);
    this.messages = new Observer();
    this.onChats = new Observer();
    this.automated = {};
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
    const id = chat.id || chat.jid;
    this.chats[id] = chat;
    this.onChats.notify(id, chat, "add");
  }

  /**
   * * Definir uma sala de bate-papo
   * @param {String} id
   * @param {Object} chat
   */
  setChat(id = "", chat = {}) {
    this.chats[id] = chat;
    this.onChats.notify(id, chat, "add");
  }

  /**
   * * Remove uma sala de bate-papo
   * @param {String} id
   */
  removeChat(id = "") {
    const chat = this.chats[id];
    delete this.chats[id];
    this.onChats.notify(id, chat, "remove");
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
    this.isConnected = true;
    this.setUser(this.plataform.sock.user);

    // Definindo status de conexão
    this.plataform.on("connection", async (update) => {
      if (update.connection === "close") {
        this.isConnected = true;
        this.setUser(this.plataform.sock.user);
      } else if (update.connection === "close") {
        this.isConnected = false;
      }
    });

    // Definindo novas salas de bate-papo
    this.on("chats", (chats) => {
      chats.map(async (chat) => {
        this.addChat(chat);
      });
    });

    // Definindo salas de bate-papo
    this.on("messages", async (m) => {
      const message = m?.messages[0];
      if (!message?.message) return;

      const id = message.key.remoteJid;

      if (!message.message.senderKeyDistributionMessage) return;
      if (this.chats[id]) return;

      this.setChat(id, { id });
    });

    // Removendo salas de bate-papo
    this.on("groups-update", (update) => {
      if (update.action != "remove") return;
      if (!update.participants.includes(this.user.id)) return;

      this.removeChat(update.id);
    });
  }

  on(eventName = "", event = () => {}) {
    this.plataform.on(eventName, event);
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
      const msg = {};

      msg.message = async (index) => {
        try {
          if (index == this.messages.get().indexOf(msg.message)) {
            await this.sleep(interval);
            await this.send(message);

            this.messages.remove(msg.message);
            this.messages.notify(index);

            resolve();
          }
        } catch (e) {
          reject(e);
        }
      };

      const m = this.messages.add(msg.message);

      const messageIndex = this.messages.get().indexOf(m);
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
  async sendMessage(message = {}, interval = 1000) {
    await this.sleep(message.time);
    return this.addMessage(message, interval);
  }

  /**
   * * Cria um tempo de espera
   * @param {Number} timeout
   * @returns
   */
  async sleep(timeout = 1000) {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  }

  /**
   * * Automotiza uma mensagem
   * @param {Object} message
   * @param {Function} sendMessageCallback
   * @param {Function} callback
   */
  async addAutomate(message = {}, sendMessageCallback = async () => {}, callback = async () => {}) {
    const now = Date.now();
    const date = new Date(now);

    // Configurando mensagem automatica
    if (!message.id) message.id = now;
    if (!message.updatedAt) message.updatedAt = now;
    if (!message.interval) message.interval = 1000;
    if (!message.hours) message.hours = date.getHours();
    if (!message.minutes) message.minutes = date.getMinutes() + 1;
    if (!message.lastDay) message.lastDay = date.getDate() - 2;

    const { id, minutes, hours, lastDay, interval, updatedAt, image, text } = message;

    if (updatedAt == this.automated[id]?.updatedAt) return;

    // Criar e atualizar dados da mensagem automatizada
    this.automated[id] = {
      ...(this.automated[id] || {}),
      ...message,
    };

    // Converter e aguardar o tempo em milesegundos
    const time = calculeTime(lastDay, hours, minutes);
    await this.sleep(time);

    // Define as salas de bate-papo da mensagem se não houver uma
    if (!this.automated[id].chats) {
      this.automated[id].chats = this.automated[id].chat || Object.keys(this.chats);
    }

    await Promise.all(
      this.automated[id].chats.map(async (chatId) => {
        if (this.automated[id].updatedAt !== updatedAt) return;
        if (!chatId) return;

        // Criar mensagem
        const msg = new Message(chatId, text);
        if (!!image) msg.image = image;

        // Enviar mensagem
        await this.sendMessage(msg, interval);

        // Remover sala de bate-papo da mensagem
        const nowChats = this.automated[id].chats;
        const index = nowChats.indexOf(this.automated[id].chats[chatId]);
        this.automated[id].chats = nowChats.splice(index + 1, nowChats.length);

        // Notificar envio da mensagem
        await sendMessageCallback(this.automated[id]);
      })
    );

    // Notificar envio de todas as mensagem
    await callback(this.automated[id]);
  }
}

module.exports = Bot;
