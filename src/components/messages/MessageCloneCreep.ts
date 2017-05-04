// import * as Config from "../../config/config";
// import {log} from "../../lib/logger/log";
import {Message} from "./Message";

export class MessageCloneCreep extends Message {
  public bodyParts: string[];
  public destinationRoomName: string;
  public destinationPosition: RoomPosition;
  public memory: {};

  constructor () {
    super();
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
