// import * as Config from "../../config/config";
// import { log } from "../../../lib/logger/log";

export class CreateMinerMessage {
  public static MessageType: string = "MESSAGE_CREEP_CREATE_MINER";

  // public static create(
  //   data: {
  //     bodyParts: string[],
  //     creepType: string,
  //     messageId: string,
  //     positionX: number,
  //     positionY: number,
  //     roomName: string,
  //     sourceId: string
  // }) {
  public static create(data: {}) {
    let message = new CreateMinerMessage();
    Object.assign(message, data);
    // message.bodyParts = data.bodyParts;
    // message.creepType = data.creepType;
    // message.messageId = data.messageId;
    // message.positionX = data.positionX;
    // message.positionY = data.positionY;
    // message.roomName = data.roomName;
    // message.sourceId = data.sourceId;
    return message;
  }

  public bodyParts: string[];
  public creepType: string;
  public messageId: number;
  public positionX: number;
  public positionY: number;
  public roomName: string;
  public sourceId: string;
}
