// import * as Config from "../../config/config";
// import { log } from "../../lib/logger/log";

export class CreateMinerMessageAck {
  public static MessageType: string = "MESSAGE_CREEP_CREATE_MINER_ACK";

  public static create(data: {}) {
    let message = new CreateMinerMessageAck();
    Object.assign(message, data);
    return message;
  }

  public messageId: number;
  public minerName: string;

  public load(
    data: {
      messageId: number,
      minerName: string,
    }) {
      this.messageId = data.messageId;
      this.minerName = data.minerName;
    }
}
