// import * as Config from "../../config/config";
import { log } from "../../lib/logger/log";

export class MineralHandler {
  public static InitializeMemory() {
    // TODO: Code goes here.
  }

  public mineral: Mineral;

  constructor (mineral: Mineral) {
    this.mineral = mineral;
  }

  public run() {
    log.info("Process mineral: " + this.mineral.mineralType + ":" + this.mineral.id );

    // TODO: Code goes here.
  }
}
