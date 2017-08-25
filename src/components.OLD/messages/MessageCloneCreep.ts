// // import * as Config from "../../config/config";
// // import {log} from "../../lib/logger/log";
// import {MessageNewCreep} from "./MessageNewCreep";

// export class MessageCloneCreep extends MessageNewCreep {
//   public originalCreepName: string;

//   constructor () {
//     super();
//   }

//   public loadFrom(data: {originalCreepName: string, bodyParts: string[], creepType: string, memory: string})
//   {
//     this.originalCreepName = data.originalCreepName;
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
