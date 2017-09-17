// import * as Config from "../../config/config";
import { log } from "../../lib/logger/log";

export class MyController {
  public controller: Controller;

  private debug: boolean = false;

  constructor (controller: Controller) {
    this.controller = controller;
  }

  public run() {
    if (this.debug) {
      log.info(this.controller.room.name + ":" + this.controller.id + " - MyController.run");
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
