import { Observable, Subscriber } from "rxjs";
import { uuid } from "uuidv4";

import Chat, { Chats } from "../infrastructure/bot/Chat";
import logger from "../infrastructure/config/logger";
import BaseBot from "../infrastructure/bot/BaseBot";
import Status from "../infrastructure/bot/Status";
import Commands from "./Commands";
import Message from "./Message";

export default class Bot {
  private _awaitSendMessages: { observable: Observable<any>; observer?: Subscriber<any> };
  private _awaitSendMessagesCount: number = 0;
  private _autoMessages: any = {};
  private _plataform: BaseBot;

  public commands: Commands;

  constructor(plataform: BaseBot, commands: Commands = new Commands()) {
    this._plataform = plataform;
    this.commands = commands;

    this._awaitSendMessages = {
      observable: new Observable((sub: Subscriber<any>) => (this._awaitSendMessages.observer = sub)),
    };
  }

  /**
   * * Construir bot
   * @param auth
   * @param config
   */
  public build(auth: string, config?: any): Promise<any> {
    return this._plataform.connect(auth, config);
  }

  /**
   * * Reconstruir o bot
   * @param config
   * @returns
   */
  public rebuild(config?: any): Promise<any> {
    return this._plataform.reconnect(config);
  }

  /**
   * * Obter Bot
   * @returns
   */
  public get(): BaseBot {
    return this._plataform;
  }

  /**
   * * Retorna o status do bot
   * @returns
   */
  public getStatus(): Status {
    return this._plataform.status;
  }

  /**
   * * Retorna uma salade bate-papo
   * @param id
   * @returns
   */
  public getChat(id: string): Chat | undefined {
    return this._plataform.chats[id];
  }

  /**
   * * Retorna todas as salas de bate-papo
   * @returns
   */
  public getChats(): Chats {
    return this._plataform.chats;
  }

  /**
   * * Adiciona um evento
   * @param eventName
   * @param event
   */
  public addEvent(eventName: "chats" | "messages" | "connection", event: any) {
    this._plataform.addEvent(eventName, event);
  }

  /**
   * * Envia um conteúdo
   * @param content
   * @returns
   */
  public async send(content: Message | Status, interval?: number): Promise<any> {
    if (content instanceof Message) {
      await this.addMessage(content, interval);

      logger.info(`Mensagem enviada para: ${content.chat.id}`);
      return;
    }

    return this._plataform.send(content);
  }

  /**
   * * Adiciona a mensagem há uma lista de mensagens para serem enviadas
   * @param message
   * @param interval
   * @returns
   */
  public async addMessage(message: Message, interval: number = 1000): Promise<any> {
    return new Promise((resolve, reject) => {
      const observer = this._awaitSendMessages.observable.subscribe(async () => {
        try {
          await this.sleep(interval);
          await this.send(message);

          observer.unsubscribe();
          this._awaitSendMessagesCount = this._awaitSendMessagesCount - 1;

          resolve(null);
        } catch (err) {
          reject(err);
        }
      });

      if (this._awaitSendMessagesCount === 0) {
        if (this._awaitSendMessages.observer) {
          this._awaitSendMessages.observer.next();
        }
      }
    });
  }

  /**
   * * Cria um tempo de espera
   * @param timeout
   * @returns
   */
  public sleep(timeout: number = 1000): Promise<any> {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  }

  /**
   * * Automotiza uma mensagem
   * @param message
   * @param timeout
   * @param interval
   * @param chats
   * @param id
   * @returns
   */
  public async addAutomate(message: Message, timeout: number, interval?: number, chats?: Chats, id: string = uuid()): Promise<any> {
    const now = Date.now();

    // Criar e atualizar dados da mensagem automatizada
    this._autoMessages[id] = { id, chats: chats || this.getChats(), updatedAt: now, message };

    // Aguarda o tempo definido
    await this.sleep(timeout - now);

    // Cancelar se estiver desatualizado
    if (this._autoMessages[id].updatedAt !== now) return;

    await Promise.all(
      this._autoMessages[id].chats.map(async (chat: Chat) => {
        const automated: any = this._autoMessages[id];

        if (automated.updatedAt !== now) return;

        automated.message?.setChat(chat);

        // Enviar mensagem
        await this.send(automated.message, interval);

        // Remover sala de bate-papo da mensagem
        const nowChats = automated.chats;
        const index = nowChats.indexOf(automated.chats[chat.id]);
        this._autoMessages[id].chats = nowChats.splice(index + 1, nowChats.length);
      })
    );
  }
}
