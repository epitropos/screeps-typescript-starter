// import * as Config from "../../config/config";
// import { log } from "../../lib/logger/log";

export class BuildContainerMessageNack {
  public static MessageType: string = "MESSAGE_STRUCTURE_BUILD_CONTAINER_NACK";

  public static create(data: {}) {
    let message = new BuildContainerMessageNack();
    Object.assign(message, data);
    return message;
  }

  public containerId: string;
  public messageId: number;
  public reason: string;
}
