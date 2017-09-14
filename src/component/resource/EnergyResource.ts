// import * as Config from "../../config/config";
import { log } from "../../lib/logger/log";

export class EnergyResource {
  public resource: Resource;

  constructor (resource: Resource) {
    this.resource = resource;
  }

  public run() {
    log.info("Process resource: " + this.resource.pos.roomName + " - " + this.resource.id);

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
