// import * as Config from "../../config/config";
import {log} from "../../lib/logger/log";
import {Request} from "./Request";

export class RequestHandler {
  constructor () {
    // No operation.
  }

  public getNextCreepRequest(creep: Creep): Request {
    log.info("Retrieving request for creep: " + creep.name);
    return new Request();
  }
}
