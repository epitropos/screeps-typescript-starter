// import * as Config from "../../config/config";
import { log } from "../../lib/logger/log";

export class MiscCreep {
  public creep: Creep;

  constructor (creep: Creep) {
    this.creep = creep;
  }

  public run() {
    log.info("Process creep: " + this.creep.room.name + ":" + this.creep.name);
  }
}
