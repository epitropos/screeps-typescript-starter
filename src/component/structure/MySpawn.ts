// import * as Config from "../../config/config";
import { log } from "../../lib/logger/log";
import { CreateMinerMessage } from "../message/creep/CreateMinerMessage";
import { CreateMinerMessageAck } from "../message/creep/CreateMinerMessageAck";
import { MessageHandler } from "../message/MessageHandler";

export class MySpawn {
  public structure: Structure;
  public spawn: Spawn;
  public messageId: number;
  public messageType: string;

  constructor (structure: Structure) {
    this.spawn = <Spawn> structure;
  }

  public run() {
    log.info("Process spawn: " + this.structure.room.name + ":" + this.structure.id);
    if (this.spawn.spawning !== undefined) {
      return;
    }

    this.initializeMemory();
    this.loadFromMemory();

    this.processNextCreateMinerMessage();

    this.saveToMemory();
  }

  private initializeMemory() {
    // TODO: Code goes here.
  }

  private loadFromMemory() {
    // TODO: Code goes here.
  }

  private saveToMemory() {
    // TODO: Code goes here.
  }

  private processNextCreateMinerMessage() {
    // TODO: May need to have a router class that assigns incoming messages to a game object id.
    let message = MessageHandler.getNextMessage(CreateMinerMessage.MessageType);
    let createMinerMessage = (message !== undefined)
      ? CreateMinerMessage.create(message)
      : undefined;
    if (createMinerMessage === undefined) {
      return;
    }

    this.messageId = createMinerMessage.messageId;
    this.messageType = CreateMinerMessage.MessageType;

    this.processCreateMinerMessage(createMinerMessage);
  }

  private processCreateMinerMessage(createMinerMessage: CreateMinerMessage) {
    let minerName = CREEP_MINER + Game.time;
    this.spawn.createCreep(
      createMinerMessage.bodyParts,
      minerName,
      {
        creepType: CREEP_MINER,
        positionX: createMinerMessage.positionX,
        positionY: createMinerMessage.positionY,
        roomName: createMinerMessage.roomName
      });
    MessageHandler.deleteMessage(CreateMinerMessage.MessageType, this.messageId);
    this.sendCreateMinerMessageAck(this.messageId, minerName);
  }

  private sendCreateMinerMessageAck(messageId: number, minerName: string) {
    let createMinerMessageAck = new CreateMinerMessageAck();
    createMinerMessageAck.messageId = messageId;
    createMinerMessageAck.minerName = minerName;
    MessageHandler.sendMessage(
      CreateMinerMessageAck.MessageType,
      this.messageId,
      JSON.stringify(createMinerMessageAck));
  }
}
