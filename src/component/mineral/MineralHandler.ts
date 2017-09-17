// import * as Config from "../../config/config";
import { log } from "../../lib/logger/log";

export class MineralHandler {
  public mineral: Mineral;

  private debug: boolean = false;

  constructor (mineral: Mineral) {
    this.mineral = mineral;
  }

  public run() {
    if (this.debug) {
      log.info(this.mineral.mineralType + ":" + this.mineral.id + " - MineralHandler.run");
    }

    // TODO: Code goes here.
  }
}
