import * as Config from "../../config/config";
import { log } from "../../lib/logger/log";
// import { BuildContainerMessage } from "../message/structure/BuildContainerMessage";
// import { BuildContainerMessageAck } from "../message/structure/BuildContainerMessageAck";
// import { BuildContainerMessageNack } from "../message/structure/BuildContainerMessageNack";
import { CreateMinerMessage } from "../message/creep/CreateMinerMessage";
import { CreateMinerMessageAck } from "../message/creep/CreateMinerMessageAck";
import { CreateMinerMessageNack } from "../message/creep/CreateMinerMessageNack";
import { MessageHandler } from "../message/MessageHandler";
import { MinerCreep } from "../creep/MinerCreep";

export class EnergySource {
  public checksum: number;
  public containerId: string | undefined;
  public messageId: number | undefined;
  public minerName: string | undefined;
  public source: Source;
  public minerPositionX: number;
  public minerPositionY: number;

  constructor (source: Source) {
    this.source = source;
  }

  // TODO: uncomment hashing and load/save memory
  public run() {
    log.info("Process source: " + this.source.room.name + ":" + this.source.id);

    this.initializeMemory();
    this.loadFromMemory();
    // let hash = calculateHash();

    this.processMiner();

    this.processContainer();

    this.saveToMemory();
    // let newHash = calculateHash();
    // if (hash != newHash) {
    //   saveToMemory();
    // }
  }

  private processContainer() {
    log.warning("processContainer");
    // // TODO: Create a method to handle container message.

    // // if containerId is set and container does not exist clear containerId (i.e. container decayed).
    // let container = (this.containerId !== undefined)
    //   ? Game.getObjectById(this.containerId)
    //   : undefined;
    // if (container === undefined) {
    //   this.containerId = undefined;
    // }
    // // if containerId not set and messageId not set send message.
    // if (this.containerId === undefined && this.messageId === undefined) {
    //   this.sendBuildContainerMessage();
    //   return;
    // }
    // // Check for Ack.
    // let buildContainerMessageAck = (this.messageId !== undefined)
    //   ? MessageHandler.getMessage(BuildContainerMessageAck.MessageType, this.messageId)
    //   : undefined;
    // // if Ack exists set containerId and clear messageId.
    // if (buildContainerMessageAck !== undefined) {
    //   this.containerId = buildContainerMessageAck.containerId;
    //   this.messageId = undefined;
    //   return;
    // }
    // // Check for Nack
    // let buildContainerMessageNack = (this.messageId !== undefined)
    //   ? MessageHandler.getMessage(BuildContainerMessageNack.MessageType, this.messageId)
    //   : undefined;
    // // If nack exists clear messageId.
    // if (buildContainerMessageNack !== undefined) {
    //   this.messageId = undefined;
    //   // TODO: Do something with the reason.
    // }
  }

  private processMiner() {
    log.warning("processMiner");
    // If minerName is set and miner does not exist clear minerName (i.e. miner died).
    let miner = (this.minerName !== undefined)
      ? Game.creeps[this.minerName]
      : undefined;
    if (miner !== undefined) {
      this.messageId = undefined;
      return;
    } else {
      this.minerName = undefined;
    }

    // If messageId not set send message.
    if (this.messageId === undefined) {
      this.sendCreateMinerMessage();
      return;
    }

    // Check for Ack.
    let createMinerMessageAck = (this.messageId !== undefined)
      ? MessageHandler.getMessage(CreateMinerMessageAck.MessageType, this.messageId)
      : undefined;

    // If Ack exists set minerName and clear messageId.
    if (createMinerMessageAck !== undefined) {
      this.messageId = undefined;
      this.minerName = createMinerMessageAck.minerName;
      return;
    }

    // Check for Nack.
    let nackMessage = (this.messageId !== undefined)
      ? MessageHandler.getMessage(CreateMinerMessageNack.MessageType, this.messageId)
      : undefined;
    // If nack exists clear messageId.
    if (nackMessage !== undefined) {
      this.messageId = undefined;
      // TODO: Do something with the reason.
      return;
    }
  }

  private determineMinerPosition(source: Source) {
    log.warning("determineMinerPosition");
    let minerPosition = source.room.memory.sources[source.id].minerPosition;
    if (minerPosition === undefined) {
      let numberOfAdjacentPositions: number = 0;

      // Look at each adjacent position and gather plains and swamps
      let adjacentPositions = this.findAdjacentPlainsAndSwamps(source, source.pos);
      for (let adjacentPosition of adjacentPositions) {
        let adjacentPositions2 = this.findAdjacentPlainsAndSwamps(source, adjacentPosition);
        if (adjacentPositions2.length > numberOfAdjacentPositions) {
          minerPosition = adjacentPosition;
          numberOfAdjacentPositions = adjacentPositions2.length;
        }
      }

      return minerPosition;
    }
  }

  private findAdjacentPlainsAndSwamps(source: Source, roomPosition: RoomPosition) {
    log.warning("findAdjacentPlainsAndSwamps");
    let adjacentPositions = new Array<RoomPosition>();

    let nwPosition = <RoomPosition> source.room.getPositionAt(roomPosition.x - 1, roomPosition.y - 1);
    if (this.isPlainOrSwamp(nwPosition)) {
      adjacentPositions.push(nwPosition);
    }

    let nPosition = <RoomPosition> source.room.getPositionAt(roomPosition.x , roomPosition.y - 1);
    if (this.isPlainOrSwamp(nPosition)) {
      adjacentPositions.push(nPosition);
    }

    let nePosition = <RoomPosition> source.room.getPositionAt(roomPosition.x + 1, roomPosition.y - 1);
    if (this.isPlainOrSwamp(nePosition)) {
      adjacentPositions.push(nePosition);
    }

    let wPosition = <RoomPosition> source.room.getPositionAt(roomPosition.x - 1, roomPosition.y);
    if (this.isPlainOrSwamp(wPosition)) {
      adjacentPositions.push(wPosition);
    }

    let ePosition = <RoomPosition> source.room.getPositionAt(roomPosition.x + 1, roomPosition.y);
    if (this.isPlainOrSwamp(ePosition)) {
      adjacentPositions.push(ePosition);
    }

    let swPosition = <RoomPosition> source.room.getPositionAt(roomPosition.x - 1, roomPosition.y + 1);
    if (this.isPlainOrSwamp(swPosition)) {
      adjacentPositions.push(swPosition);
    }

    let sPosition = <RoomPosition> source.room.getPositionAt(roomPosition.x , roomPosition.y + 1);
    if (this.isPlainOrSwamp(sPosition)) {
      adjacentPositions.push(sPosition);
    }

    let sePosition = <RoomPosition> source.room.getPositionAt(roomPosition.x + 1, roomPosition.y + 1);
    if (this.isPlainOrSwamp(sePosition)) {
      adjacentPositions.push(sePosition);
    }

    return adjacentPositions;
  }

  private isPlainOrSwamp(roomPosition: RoomPosition) {
    log.warning("isPlainOrSwamp");
    let terrain = Game.map.getTerrainAt(roomPosition);
    if (terrain === "plain" || terrain === "swamp") {
      return true;
    }
    return false;
  }

  private initializeMemory() {
    log.warning("initializeMemory");
    if (this.source.room.memory.sources[this.source.id] === undefined) {
      this.source.room.memory.sources[this.source.id] = {};
    }
  }

  private loadFromMemory() {
    log.warning("loadFromMemory");
    this.checksum = this.source.room.memory.sources[this.source.id].checksum;
    this.containerId = this.source.room.memory.sources[this.source.id].containerId;
    this.messageId = this.source.room.memory.sources[this.source.id].messageId;
    this.minerName = this.source.room.memory.sources[this.source.id].minerName;
    this.minerPositionX = this.source.room.memory.sources[this.source.id].minerPositionX;
    this.minerPositionY = this.source.room.memory.sources[this.source.id].minerPositionY;

    if (this.minerPositionX === undefined || this.minerPositionY === undefined) {
      let minerPosition = this.determineMinerPosition(this.source);
      this.minerPositionX = minerPosition.x;
      this.minerPositionY = minerPosition.y;
    }
  }

  private saveToMemory() {
    log.warning("saveToMemory");
    // TODO: Implement hash checksum to skip save if nothing is different.
    this.source.room.memory.sources[this.source.id].checksum = this.checksum;
    this.source.room.memory.sources[this.source.id].containerId = this.containerId;
    this.source.room.memory.sources[this.source.id].messageId = this.messageId;
    this.source.room.memory.sources[this.source.id].minerName = this.minerName;
    this.source.room.memory.sources[this.source.id].minerPositionX = this.minerPositionX;
    this.source.room.memory.sources[this.source.id].minerPositionY = this.minerPositionY;
  }

  // private sendBuildContainerMessage() {
  //   log.warning("sendBuildContainerMessage");
  //   let message = new BuildContainerMessage();
  //   message.messageId = MessageHandler.nextMessageId();
  //   message.positionX = this.minerPositionX;
  //   message.positionY = this.minerPositionY;
  //   message.roomName = this.source.room.name;
  //   message.sourceId = this.source.id;

  //   MessageHandler.sendMessage(
  //     BuildContainerMessage.MessageType,
  //     message.messageId,
  //     JSON.stringify(message));
  // }

  private sendCreateMinerMessage() {
    log.warning("sendCreateMinerMessage");
    let message = new CreateMinerMessage();
    let energyAvailable = _.max([this.source.room.energyAvailable / 2, MinerCreep.MinimumEnergyRequired]);
    let bodyParts = MinerCreep.getBodyParts(energyAvailable);
    if (bodyParts !== undefined) {
      message.bodyParts = bodyParts;
    }
    message.creepType = Config.CREEP_MINER;
    message.positionX = this.minerPositionX;
    message.positionY = this.minerPositionY;
    message.sourceId = this.source.id;

    MessageHandler.sendMessage(
      CreateMinerMessage.MessageType,
      message.messageId,
      JSON.stringify(message));
  }
}
