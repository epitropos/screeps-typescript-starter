// import * as Config from "../../config/config";
import { log } from "../../lib/logger/log";
import { MinerCreep } from "./MinerCreep";
import { MiscCreep } from "./MiscCreep";

export class CreepHandler {
  public static InitializeMemory() {
    // TODO: Code goes here.
  }

  public creep: Creep;

  constructor (creep: Creep) {
    this.creep = creep;
  }

  public run() {
    switch (this.creep.memory.role) {
      case CREEP_MINER:
        let controller = new MinerCreep(this.creep);
        controller.run();
        break;
      case CREEP_MISC:
        let spawn = new MiscCreep(this.creep);
        spawn.run();
        break;
      default:
        log.error("Unknown creep type: " + this.creep.memory.role + "(Name: " + this.creep.name + ")");
        break;
    }
  }
}
