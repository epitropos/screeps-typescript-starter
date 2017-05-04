// import * as Config from "../../config/config";
import {log} from "../../lib/logger/log";
import {Message} from "./Message";
import {MessageCloneCreep} from "./MessageCloneCreep";

export class MessageHandler {
  public static MESSAGE_TYPE_CLONE_CREEP: string = "cloneCreep";

  public static InitializeMemory() {
    if (!Memory.messages) { Memory.messages = {}; }
    if (!Memory.messages.cloneCreep) { Memory.messages.cloneCreep = {}; }
    if (!Memory.messages.nextMessageId) { Memory.messages.nextMessageId = 1; }
  }

  constructor () {
    // No operation.
  }

  public test() {
    let messages = Memory.messages.cloneCreep;
    log.info("messages: " + messages);
    log.info("messages.length: " + messages.length);
    if (messages && messages.length || 0 === 0) {
      log.info("here");
      let cloneMyCreep = new MessageCloneCreep();
      cloneMyCreep.bodyParts = [WORK, CARRY, MOVE];
      cloneMyCreep.destinationPosition = new RoomPosition(30, 30, "N1W1");
      cloneMyCreep.memory = { foo: "bar", role: "myCreep" };
      this.sendMessage(MessageHandler.MESSAGE_TYPE_CLONE_CREEP, cloneMyCreep);
    }
  }

  public getNextCreepMessage(creep: Creep): Message {
    log.info("Retrieving message for creep: " + creep.name);
    return new Message();
  }

  public getNextMessage(messageType: string): Message | undefined {
    if (messageType === MessageHandler.MESSAGE_TYPE_CLONE_CREEP) {
      return this.getNextMessageCloneCreep();
    }

    return undefined;
  }

  public getNextMessageCloneCreep(): Message | undefined {
    let cloneCreepMessages = Memory.messages.cloneCreep;
    if (!cloneCreepMessages) {
      return undefined;
    }
    let cloneCreepMesage = cloneCreepMessages[0];
    log.info("cloneCreepMesage: " + cloneCreepMesage);
  }

  public sendMessage(messageType: string, payload: Message) {
    if (messageType === MessageHandler.MESSAGE_TYPE_CLONE_CREEP) {
      this.sendMessageCloneCreep(<MessageCloneCreep> payload);
    }
  }

  public sendMessageCloneCreep(payload: MessageCloneCreep) {
    let nextMessageId = Memory.messages.nextMessageId;
    Memory.messages.cloneCreep.nextMessageId++;
    Memory.messages.cloneCreep[nextMessageId] = {};
    Memory.messages.cloneCreep[nextMessageId].bodyParts = payload.bodyParts;
    Memory.messages.cloneCreep[nextMessageId].destinationRoomName = payload.destinationRoomName;
    Memory.messages.cloneCreep[nextMessageId].destinationPosition = payload.destinationPosition;
    Memory.messages.cloneCreep[nextMessageId].memory = JSON.stringify(payload.memory);
  }
}
