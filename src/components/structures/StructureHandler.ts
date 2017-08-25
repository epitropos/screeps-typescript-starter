// import * as Config from "../../config/config";
import { log } from "../../lib/logger/log";

export class StructureHandler {
  public static InitializeMemory() {
    // TODO: Code goes here.
  }

  public structure: Structure;

  constructor (structure: Structure) {
    this.structure = structure;
  }

  public run() {
    log.info("Process structure: " + this.structure.structureType + ":" + this.structure.id );

    // TODO: Code goes here.
  }
}
