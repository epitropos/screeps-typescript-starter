// import * as Config from "../../config/config";
import { log } from "../../lib/logger/log";

export class MiscCreep {
  public creep: Creep;

  private debug: boolean = false;

  constructor (creep: Creep) {
    this.creep = creep;
  }

  public run() {
    if (this.debug) {
      log.info(this.creep.room.name + ":" + this.creep.name + " - MiscCreep.run");
    }

    this.initializeMemory();
    this.loadFromMemory();

    // TODO: Code goes here.

    this.saveToMemory();
  }

  private initializeMemory() {
    // TODO: Code goes here.
  }

  private loadFromMemory() {
    // TODO: Code goes here.
  }

  private saveToMemory() {
    // TODO: Code goes here.
  }
}
