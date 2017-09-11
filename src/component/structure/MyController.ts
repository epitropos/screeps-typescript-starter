// import * as Config from "../../config/config";
import { log } from "../../lib/logger/log";

export class MyController {
  public structure: Structure;

  constructor (structure: Structure) {
    this.structure = structure;
  }

  public run() {
    log.info("Process controller: " + this.structure.room.name + " - " + this.structure.id);

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
