const {
  default: makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
  downloadMediaMessage,
} = require("@adiwajshing/baileys");
const logger = require("../infrastructure/config/logger");
const waLogger = require("../infrastructure/config/waLogger");

class Baileys {
  constructor() {
    this.sock = {};
    this.authPath = "./";
    this.config = {
      printQRInTerminal: true,
      logger: waLogger,
      auth: null,
    };
    this.isConnected = false;

    // Injetando funções do Baileys
    this.makeWASocket = makeWASocket;
    this.useMultiFileAuthState = useMultiFileAuthState;
    this.DisconnectReason = DisconnectReason;
    this.downloadMediaMessage = downloadMediaMessage;
  }

  /**
   * * Conectando ao servidor do WhatsApp
   * @param {String} authPath
   * @param {Object} config
   */
  async connect(authPath = this.authPath, config = this.config) {
    return await new Promise(async (resolve, reject) => {
      try {
        this.authPath = authPath;
        this.config = config;

        const { state, saveCreds } = await useMultiFileAuthState(authPath);

        this.config.auth = state;
        this.saveCreds = saveCreds;

        this.sock = makeWASocket(this.config);
        this.sock.ev.on("creds.update", this.saveCreds);

        // Injetando funções do Socket
        this.updateMediaMessage = this.sock.updateMediaMessage;
        this.groupAcceptInvite = this.sock.groupAcceptInvite;
        this.onWhatsApp = this.sock.onWhatsApp;
        this.readMessages = this.sock.readMessages;
        this.on = this.sock.ev.on;

        // Verificando se bot conectou
        this.on("connection.update", async (update) => {
          const { connection, lastDisconnect, qr } = update;

          if (qr) {
            logger.info("Escaneie o seguinte QR Code para conectar o bot:");
          }

          if (connection == "close") {
            const status = lastDisconnect?.error?.output?.statusCode;
            if (status !== DisconnectReason.loggedOut) {
              resolve(await this.reconnect());
            }
          }

          if (connection == "open") resolve();
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * * Reconecta ao servidor do WhatsApp
   * @param {Object} config
   * @returns
   */
  async reconnect(config = this.config) {
    return await this.connect(this.authPath, config);
  }

  /**
   * * Desliga a conexão com o servidor do WhatsApp
   * @param {String} code
   * @returns
   */
  async stop(reason = DisconnectReason.loggedOut) {
    return await this.sock.end(reason);
  }

  /**
   * * Envia uma mensagem
   * @param {String, Object} message
   * @param {Object} ctx
   * @param {Object} options
   * @returns
   */
  async sendMessage(message = {}, ctx = {}, options = {}) {
    if (typeof message === "string") {
      return this.sock.sendMessage(message, ctx, options);
    }

    const { chat, msg, context } = this.refactoryMessage(message);
    return this.sock.sendMessage(chat, msg, context);
  }

  /**
   * * Define o status do bot
   * @param {String} status
   * @param {Array} chat
   * @returns
   */
  async setStatus(status, chat) {
    switch (status) {
      case "online":
        status = "available";
        break;
      case "sending":
        status = "composing";
        break;
    }

    return await this.sock?.sendPresenceUpdate(status, chat);
  }

  /**
   * * Refatora uma mensagem para ser suportada no servidor do WhatsApp
   * @param {Object} message
   * @returns
   */
  refactoryMessage(message = {}) {
    if (typeof message === "string") message = { text: message };

    if (message.buttons) return message;

    const { chat, text, image, video, mention } = message;
    const msg = {};
    const context = {};

    if (video || image) msg.caption = text;
    else if (text) msg.text = text;

    if (image) msg.image = image;
    else if (video) msg.video = video;

    if (mention) context.quoted = mention;

    return { chat, msg, context };
  }
}

module.exports = Baileys;
