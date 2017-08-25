// import * as Config from "../../config/config";
import { log } from "../../lib/logger/log";
import { MyController } from "./MyController";
import { MySpawn } from "./MySpawn";

export class StructureHandler {
  public static InitializeMemory() {
    // TODO: Code goes here.
  }

  public structure: Structure;

  constructor (structure: Structure) {
    this.structure = structure;
  }

  public run() {
    switch (this.structure.structureType) {
      case STRUCTURE_CONTROLLER:
        let controller = new MyController(this.structure);
        controller.run();
        break;
      case STRUCTURE_SPAWN:
        let spawn = new MySpawn(this.structure);
        spawn.run();
        break;
      default:
        log.error("Unknown structure type: " + this.structure.structureType + "(Name: " + this.structure.id + ")");
        break;
    }
  }
}
