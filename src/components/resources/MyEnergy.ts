// import * as Config from "../../config/config";
import { log } from "../../lib/logger/log";

export class MyEnergy {
  public resource: Resource;

  constructor (resource: Resource) {
    this.resource = resource;
  }

  public run() {
    log.info("Process resource: " + this.resource.pos.roomName + ":" + this.resource.id);
  }
}
