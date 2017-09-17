// import * as Config from "../../config/config";
import { log } from "../../lib/logger/log";
import { MyController } from "./MyController";
import { MySpawn } from "./MySpawn";

export class StructureHandler {
  public structure: Structure;

  private debug: boolean = false;

  constructor (structure: Structure) {
    this.structure = structure;
  }

  public run() {
    if (this.debug) {
      log.info(this.structure.room.name + ":" + this.structure.id + " - StructureHandler.run");
    }

    switch (this.structure.structureType) {
      case STRUCTURE_CONTROLLER:
        let controller = new MyController(<Controller> this.structure);
        controller.run();
        break;
      case STRUCTURE_SPAWN:
        let spawn = new MySpawn(<Spawn> this.structure);
        spawn.run();
        break;
      default:
        log.error("Unknown structure type: " + this.structure.structureType + "(Name: " + this.structure.id + ")");
        break;
    }
  }
}
