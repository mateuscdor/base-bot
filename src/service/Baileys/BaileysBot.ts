import { Boom } from "@hapi/boom";
import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  downloadMediaMessage,
  proto,
  MediaDownloadOptions,
  UserFacingSocketConfig,
  ConnectionState,
  WAMessage,
  MessageUpsertType,
} from "@adiwajshing/baileys";

import { loggerConfig } from "../../infrastructure/config/logger";
import BaseBot from "../../infrastructure/bot/BaseBot";
import convertMessage from "./ConvertMessageBaileys";
import Status from "../../infrastructure/bot/Status";
import BaileysMessage from "./BaileysMessage";
import Message from "../../domain/Message";

export default class BaileysBot extends BaseBot {
  private _auth: string = "";
  private _bot: any = {};

  public DisconnectReason = DisconnectReason;
  public config: UserFacingSocketConfig;
  public bot: any = {};

  public statusOpts: any = {
    typing: "composing",
    reading: "reading",
    recording: "recording",
    online: "available",
    offline: "unavailable",
  };

  constructor(config?: any) {
    super();

    this.config = config || {
      printQRInTerminal: true,
      logger: loggerConfig({ level: "silent" }),
    };
  }

  /**
   * * Conectando ao servidor do WhatsApp
   * @param auth
   * @param config
   * @returns
   */
  public async connect(auth: string, config?: UserFacingSocketConfig): Promise<any> {
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

        this._bot.ev.on("messages.upsert", (m: { messages: WAMessage[]; type: MessageUpsertType }) => {
          if (m.messages.length <= 0) return;

          const message: WAMessage = m.messages[m.messages.length - 1];
          const msg = convertMessage(message, m.type);
          
          this.events.messages.next(msg);
        });

        // Verificando se bot conectou
        this._bot.ev.on("connection.update", async (update: ConnectionState) => {
          const status = (update.lastDisconnect?.error as Boom)?.output?.statusCode || update.lastDisconnect?.error || 500;

          this.events.connection.next({ action: update.connection, status, login: update?.qr });

          if (update.connection == "open") {
            this.status.setStatus("online");

            // Removendo caracteres do ID do bot
            const id = this._bot.user.id.replace(/:(.*)@/, "@");
            this.bot = { ...this._bot.user, id };

            resolve(true);
          }

          if (update.connection == "close") {
            this.status.setStatus("offline");

            // Bot desligado
            if (status === DisconnectReason.loggedOut) return;

            resolve(await this.reconnect(this.config));
          }
        });
      } catch (err: any) {
        reject(err?.stack || err);
      }
    });
  }

  /**
   * * Reconecta ao servidor do WhatsApp
   * @param config
   * @returns
   */
  public reconnect(config?: UserFacingSocketConfig): Promise<any> {
    this.events.connection.next({ action: "reconnecting" });
    return this.connect(this._auth, config || this.config);
  }

  /**
   * * Desliga a conexão com o servidor do WhatsApp
   * @param reason
   * @returns
   */
  public stop(reason?: DisconnectReason): Promise<any> {
    return this._bot.end(reason || DisconnectReason.loggedOut);
  }

  /**
   * * Envia um conteúdo
   * @param content
   * @returns
   */
  public async send(content: Message | Status): Promise<any> {
    if (content instanceof Message) {
      const { chat, message, context } = new BaileysMessage(content);
      return this._bot?.sendMessage(chat, message, context);
    }

    if (content instanceof Status) {
      const status: string = this.statusOpts[content.status];
      return this._bot?.sendPresenceUpdate(status, content.chat?.id);
    }
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
