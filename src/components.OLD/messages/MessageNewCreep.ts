// // import * as Config from "../../config/config";
// // import {log} from "../../lib/logger/log";
// import {Message} from "./Message";

// export class MessageNewCreep extends Message {
//   public bodyParts: string[];
//   public creepType: string;
//   public memory: {};

//   constructor () {
//     super();
//   }

//   public loadFrom(data: {bodyParts: string[], creepType: string, memory: string}) {
//     // super.loadFrom(data);
//     this.bodyParts = data.bodyParts;
//     this.creepType = data.creepType;
//     this.memory = data.memory;
//   }

//   // public createMessage() {
//   //   let nextMessageId = Memory.messages.nextMessageId;
//   //   Memory.messages.nextMessageId++;
//   //   Memory.messages[nextMessageId] = {};
//   //   Memory.messages[nextMessageId].bodyParts = this.bodyParts;
//   //   Memory.messages[nextMessageId].destinationRoomName = this.destinationRoomName;
//   //   Memory.messages[nextMessageId].destinationPosition = this.destinationPosition;
//   //   Memory.messages[nextMessageId].memory = JSON.stringify(this.memory);
//   // }
// }
