import makeWASocket, { DisconnectReason, useMultiFileAuthState, downloadMediaMessage, proto, MediaDownloadOptions } from "@adiwajshing/baileys";
import { Observable } from "rxjs";

import logger, { loggerConfig } from "../infrastructure/config/logger";
import Status from "../infrastructure/utils/Status";
import Events from "../infrastructure/utils/Events";
import Chat from "../infrastructure/utils/Chat";
import { Plataform } from "./Plataform";
import Message from "../domain/Message";

class Baileys implements Plataform {
  private _auth: string = "";
  private _bot: any = {};

  public config: any;
  public status: Status;
  public chats: Array<Chat>;
  public DisconnectReason = DisconnectReason;

  public events: Events = {
    messages: new Observable(),
    connection: new Observable(),
    chats: new Observable(),
  };

  constructor(config: any) {
    this.chats = [];
    this.status = new Status("offline");

    this.config = config || {
      printQRInTerminal: true,
      logger: loggerConfig({ level: "silent" }),
    };
  }

  /**
   * * Conectando ao servidor do WhatsApp
   * @param {String} authPath
   * @param {Any} config
   */
  async connect(auth: string, config?: any): Promise<any> {
    return await new Promise(async (resolve, reject) => {
      try {
        if (!config) {
          config = this.config;
        }

        this._auth = auth;
        this.config = config || this.config;

        const { state, saveCreds } = await useMultiFileAuthState(this._auth);

        this._bot = makeWASocket({ ...this.config, auth: state });
        this._bot.ev.on("creds.update", saveCreds);

        // Verificando se bot conectou
        this._bot.ev.on("connection.update", async (update: any) => {
          const { connection, lastDisconnect, qr } = update;

          if (qr) {
            logger.info("Escaneie o seguinte QR Code para conectar o bot:");
          }

          if (connection == "open") {
            logger.info("Bot conectado!");
            resolve(null);
          }

          if (connection == "close") {
            const status = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error || 500;

            if (status !== DisconnectReason.restartRequired) {
              const err = DisconnectReason[status] || JSON.stringify(lastDisconnect, ["\n"], 2);

              logger.error(`Conexao fechada devido ao erro: ${err}`);
            }

            if (status !== DisconnectReason.loggedOut) {
              return await this.reconnect();
            }

            logger.warn("Bot desligado.");
          }
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
  async reconnect(config?: any) {
    logger.warn("Reconectando...");
    return await this.connect(this._auth, config || this.config);
  }

  /**
   * * Desliga a conexão com o servidor do WhatsApp
   * @param {String} code
   * @returns
   */
  async stop(reason?: DisconnectReason) {
    return await this._bot.end(reason || DisconnectReason.loggedOut);
  }

  /**
   * * Envia uma mensagem
   * @param {String, Object} message
   * @param {Object} ctx
   * @param {Object} options
   * @returns
   */
  async send(message: Message | Status) {
    if (message instanceof Message) {
      const { chat, msg, context } = this.refactoryMessage(message);

      return this._bot.sendMessage(chat, msg, context);
    }
  }

  /**
   * * Define o status do bot
   * @param {String} status
   * @param {Array} chat
   * @returns
   */
  setStatus(stt: Status) {
    let chat: any = stt.chat;
    let status: string = "";
    switch (stt.status) {
      case "online":
        status = "available";
        break;
      case "typing":
        status = "composing";
        break;
    }

    if (!!!chat) chat = null;

    return this._bot?.sendPresenceUpdate(status, chat);
  }

  /**
   * * Refatora uma mensagem para ser suportada no servidor do WhatsApp
   * @param {Object} message
   * @returns
   */
  refactoryMessage(message: Message): any {
    const { chat, text, mention } = message;

    const msg: any = {};
    const context: any = {};

    if (text) msg.text = text;
    if (mention) context.quoted = mention;

    return { chat, msg, context };
  }

  /**
   * * Adiciona um evento
   * @param {String} eventName
   * @param {Function} event
   * @returns
   */
  addEvent(eventName: "connection" | "messages" | "chats", event: any) {
    this.events[eventName].subscribe(event);
  }

  /**
   * * Faz o download de arquivos do WhatsApp
   * @param message
   * @param type
   * @param options
   * @param ctx
   * @returns
   */
  public download(message: proto.IWebMessageInfo, type: "buffer" | "stream", options: MediaDownloadOptions, ctx?: any): Promise<any> {
    return downloadMediaMessage(message, type, options, ctx);
  }

  /**
   * * Verifica se o número está registrado no WhatsApp
   * @returns
   */
  public onWhatsApp(id: Array<string> | string): any {
    return this._bot.onWhatsApp(id);
  }

  // TODO
  public updateMediaMessage(): any {
    return this._bot.updateMediaMessage(...arguments);
  }

  // TODO
  public groupAcceptInvite(): any {
    return this._bot.groupAcceptInvite(...arguments);
  }

  // TODO
  public readMessages() {
    return this._bot.readMessages(...arguments);
  }
}

module.exports = Baileys;
