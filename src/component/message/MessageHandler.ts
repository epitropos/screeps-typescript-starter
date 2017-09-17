// import * as Config from "../../config/config";
import { log } from "../../lib/logger/log";

export class MessageHandler {
  public static InitializeMemory() {
    if (!Memory.messages) { Memory.messages = {}; }
    // if (!Memory.messages.cloneCreep) { Memory.messages.cloneCreep = {}; }
    // if (!Memory.messages.nextMessageId) { Memory.messages.nextMessageId = 1; }
  }

  public static getMessage(messageType: string, messageId: number) {
    return Memory.messages[messageType][messageId];
  }

  public static getNextMessage(messageType: string) {
    if (MessageHandler.debug) {
      log.info("MessageHandler.getNextMessage");
      log.info("messageType == " + messageType);
    }
    // TODO: first is not getting an iterator for the collection and is returning undefined|null.
    return _.first(Memory.messages[messageType]);
  }

  public static sendMessage(messageType: string, messageId: number, serializedMessage: string) {
    // TODO: Checking every time bad. Checking once good.
    if (Memory.messages[messageType] === undefined) {
      Memory.messages[messageType] = {};
    }
    Memory.messages[messageType][messageId] = serializedMessage;
  }

  public static nextMessageId() {
    return Memory.messages.nextMessageId++;
  }

  public static deleteMessage(messageType: string, messageId: number) {
    delete Memory.messages[messageType][messageId];
  }

  public static subscribeToMessage(subscribedMessageType: string, objectId: string) {
    let messageType = "subscribers";
    Memory.messages[messageType][subscribedMessageType].Add(objectId);
  }

  public static unsubscribeFromMessage(subscribedMessageType: string, objectId: string) {
    let messageType = "subscribers";
    Memory.messages[messageType][subscribedMessageType].Remove(objectId);
  }

  public static getSubscribers(subscribedMessageType: string) {
    let messageType = "subscribers";
    return Memory.messages[messageType][subscribedMessageType];
  }

  private static debug: boolean = true;

  // constructor () {
  //   // No operation.
  // }
}
