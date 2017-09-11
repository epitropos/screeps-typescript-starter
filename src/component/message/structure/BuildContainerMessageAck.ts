// import * as Config from "../../config/config";
// import { log } from "../../lib/logger/log";

export class BuildContainerMessageAck {
  public static MessageType: string = "MESSAGE_STRUCTURE_BUILD_CONTAINER_ACK";

  public static create(data: {}) {
    let message = new BuildContainerMessageAck();
    Object.assign(message, data);
    return message;
  }

  public containerId: string;
  public messageId: number;
}
