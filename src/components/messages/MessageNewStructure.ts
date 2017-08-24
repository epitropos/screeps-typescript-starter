// import * as Config from "../../config/config";
// import {log} from "../../lib/logger/log";
import {Message} from "./Message";

export class MessageNewStructure extends Message {
  public structureType: string;
  public memory: {};

  constructor () {
    super();
  }

  public loadFrom(data: {structureType: string, memory: string})
  {
    super.loadFrom(data);
    this.structureType = data.structureType;
    this.memory = data.memory;
  }

  // public createMessage() {
  //   let nextMessageId = Memory.messages.nextMessageId;
  //   Memory.messages.nextMessageId++;
  //   Memory.messages[nextMessageId] = {};
  //   Memory.messages[nextMessageId].bodyParts = this.bodyParts;
  //   Memory.messages[nextMessageId].destinationRoomName = this.destinationRoomName;
  //   Memory.messages[nextMessageId].destinationPosition = this.destinationPosition;
  //   Memory.messages[nextMessageId].memory = JSON.stringify(this.memory);
  // }
}
