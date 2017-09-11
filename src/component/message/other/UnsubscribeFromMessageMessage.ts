// import * as Config from "../../config/config";
// import { log } from "../../lib/logger/log";

export class UnsubscribeToMessageMessage {
  public static create(data: {}) {
    let message = new UnsubscribeToMessageMessage();
    Object.assign(message, data);
    return message;
  }

  public objectId: string;
  public messageType: string;
}
