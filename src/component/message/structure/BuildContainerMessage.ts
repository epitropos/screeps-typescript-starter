// import * as Config from "../../config/config";
// import { log } from "../../lib/logger/log";

export class BuildContainerMessage {
  public static MessageType: string = "MESSAGE_STRUCTURE_BUILD_CONTAINER";

  // public static create(
  //   data: {
  //     messageId: number,
  //     positionX: number,
  //     positionY: number,
  //     roomName: string,
  //     sourceId: string
  // }) {
  public static create(data: {}) {
    let message = new BuildContainerMessage();
    Object.assign(message, data);
    // message.messageId = data.messageId;
    // message.positionX = data.positionX;
    // message.positionY = data.positionY;
    // message.roomName = data.roomName;
    // message.sourceId = data.sourceId;
    return message;
  }

  public messageId: number;
  public positionX: number;
  public positionY: number;
  public roomName: string;
  public sourceId: string;
}
