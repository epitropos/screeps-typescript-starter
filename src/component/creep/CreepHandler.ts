import * as Config from "../../config/config";
import { log } from "../../lib/logger/log";
import { MinerCreep } from "./MinerCreep";
import { MiscCreep } from "./MiscCreep";

export class CreepHandler {
  public creep: Creep;

  private debug: boolean = false;

  constructor (creep: Creep) {
    this.creep = creep;
  }

  public run() {
    if (this.debug) {
      log.info(this.creep.id + " - CreepHandler.run");
    }

    switch (this.creep.memory.role) {
      case Config.CREEP_MINER:
        let controller = new MinerCreep(this.creep);
        controller.run();
        break;
      case Config.CREEP_MISC:
        let spawn = new MiscCreep(this.creep);
        spawn.run();
        break;
      default:
        log.error("Unknown creep type: " + this.creep.memory.role + "(Name: " + this.creep.name + ")");
        break;
    }
  }
}
