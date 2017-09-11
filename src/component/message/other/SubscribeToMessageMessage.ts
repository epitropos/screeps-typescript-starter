// import * as Config from "../../config/config";
// import { log } from "../../lib/logger/log";

export class SubscribeToMessageMessage {
  public static create(data: {}) {
    let message = new SubscribeToMessageMessage();
    Object.assign(message, data);
    return message;
  }

  public objectId: string;
  public messageType: string;
}
