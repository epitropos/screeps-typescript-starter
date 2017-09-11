// import * as Config from "../../config/config";
// import { log } from "../../lib/logger/log";

export class CreateMinerMessageNack {
  public static MessageType: string = "MESSAGE_CREEP_CREATE_MINER_NACK";

  public static create(data: {}) {
    let message = new CreateMinerMessageNack();
    Object.assign(message, data);
    return message;
  }

  public messageId: number;
  public reason: string;
}
