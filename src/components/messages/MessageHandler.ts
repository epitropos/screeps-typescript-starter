import * as C from "../../config/constants";
// import * as Config from "../../config/config";
// import {log} from "../../lib/logger/log";
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

  public testSend() {
    let scouts = Game.rooms.W7N9.find(FIND_MY_CREEPS, {
      filter: (c: Creep) => c.memory.role === C.SCOUT,
    });

    if (scouts && scouts.length > 0) {
      return;
    }

    let messages = Memory.messages.cloneCreep;
    if (messages && messages.length || 0 === 0) {
      // let creep = new Creep("asdf");
      // let roomHandler = new RoomHandler(Game.rooms.W7N9);
      // let myCreep = new CreepScout(creep, roomHandler);

      let cloneMyCreep = new MessageCloneCreep();
      // cloneMyCreep.bodyParts = myCreep.creep.body.map<string>(bp => bp.type);
      // cloneMyCreep.creepType = myCreep.creep.memory.role;
      // cloneMyCreep.memory = { destinationPosition: myCreep.creep.pos, role: myCreep.creep.memory.role };
      cloneMyCreep.bodyParts = [MOVE];
      cloneMyCreep.creepType = C.SCOUT;
      cloneMyCreep.memory = { destinationPosition: new RoomPosition(29, 19, "W7N9"), role: C.SCOUT };
      this.sendMessage(MessageHandler.MESSAGE_TYPE_CLONE_CREEP, cloneMyCreep);
    }
  }

  public testReceive(messageType: string) {
    let message = <MessageCloneCreep> this.getNextMessage(messageType);
    if (message === undefined) {
      return;
    } else {
    }

    let room = Game.rooms.W7N9;
    let spawns = room.find<Spawn>(FIND_MY_SPAWNS);
    if (spawns === undefined || spawns.length === 0) {
      return;
    }

    let spawn = spawns[0];
    spawn.createCreep(
      message.bodyParts,
      message.creepType + Memory.uuid++,
      message.memory);
  }

  // public getNextCreepMessage(creep: Creep): Message {
  //   // log.info("Retrieving message for creep: " + creep.name);
  //   return new Message();
  // }

  public getNextMessage(messageType: string): Message | undefined {
    // if (messageType === MessageHandler.MESSAGE_TYPE_CLONE_CREEP) {
    //   return this.getNextMessageCloneCreep();
    // }

    // return undefined;

    let messages = Memory.messages[messageType];
    if (messages === undefined || messages.length === 0) {
      return undefined;
    }

    for (let messageId in messages) {
      let serializedMessage = messages[messageId];
      delete Memory.messages[messageType][messageId];
      return JSON.parse(serializedMessage);
    }

    return undefined;
  }

  // public getNextMessageCloneCreep(): Message | undefined {
  //   let cloneCreepMessages = Memory.messages.cloneCreep;
  //   if (!cloneCreepMessages) {
  //     return undefined;
  //   }

  //   for (let cloneCreepMessageId in cloneCreepMessages) {
  //     let cloneCreepMesage = cloneCreepMessages[cloneCreepMessageId];
  //     log.info("cloneCreepMesage: " + cloneCreepMesage);

  //     if (cloneCreepMesage) {
  //       delete Memory.messages.cloneCreep[cloneCreepMessageId];
  //       return cloneCreepMesage;
  //     }
  //   }

  //   return undefined;
  // }

  public sendMessage(messageType: string, payload: Message) {
    // if (messageType === MessageHandler.MESSAGE_TYPE_CLONE_CREEP) {
    //   this.sendMessageCloneCreep(<MessageCloneCreep> payload);
    // }
    let nextMessageId = Memory.messages.nextMessageId++;
    Memory.messages[messageType][nextMessageId] = JSON.stringify(payload);
  }

  // public sendMessageCloneCreep(payload: MessageCloneCreep) {
  //   let nextMessageId = Memory.messages.nextMessageId++;
  //   Memory.messages.cloneCreep[nextMessageId] = {};
  //   Memory.messages.cloneCreep[nextMessageId].bodyParts = payload.bodyParts;
  //   Memory.messages.cloneCreep[nextMessageId].destinationRoomName = payload.destinationRoomName;
  //   Memory.messages.cloneCreep[nextMessageId].destinationPosition = payload.destinationPosition;
  //   Memory.messages.cloneCreep[nextMessageId].memory = JSON.stringify(payload.memory);
  // }
}
