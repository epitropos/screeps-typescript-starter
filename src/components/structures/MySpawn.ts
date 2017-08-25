// import * as Config from "../../config/config";
import { log } from "../../lib/logger/log";

export class MySpawn {
  public structure: Structure;

  constructor (structure: Structure) {
    this.structure = structure;
  }

  public run() {
    log.info("Process spawn: " + this.structure.room.name + ":" + this.structure.id);
  }
}
