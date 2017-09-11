// import * as Config from "../../config/config";
import { log } from "../../lib/logger/log";

export class MiscCreep {
  public creep: Creep;

  constructor (creep: Creep) {
    this.creep = creep;
  }

  public run() {
    log.info("Process misc creep: " + this.creep.room.name + " - " + this.creep.name);

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
