// import * as Config from "../../config/config";
import {log} from "../../lib/logger/log";
import {Message} from "./Message";

export class MessageHandler {
  constructor () {
    // No operation.
  }

  public getNextCreepMessage(creep: Creep): Message {
    log.info("Retrieving message for creep: " + creep.name);
    return new Message();
  }
}
