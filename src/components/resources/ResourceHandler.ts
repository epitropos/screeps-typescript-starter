// import * as Config from "../../config/config";
import { log } from "../../lib/logger/log";

export class ResourceHandler {
  public static InitializeMemory() {
    // TODO: Code goes here.
  }

  public resource: Resource;

  constructor (resource: Resource) {
    this.resource = resource;
  }

  public run() {
    log.info("Process resource: " + this.resource.resourceType + ":" + this.resource.id );

    // TODO: Code goes here.
  }
}
