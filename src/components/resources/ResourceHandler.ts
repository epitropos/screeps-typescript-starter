// import * as Config from "../../config/config";
import { log } from "../../lib/logger/log";
// import { ResourceFactory } from "./ResourceFactory";
import { MyEnergy } from "./MyEnergy";

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

    switch (this.resource.resourceType) {
      case RESOURCE_ENERGY:
        let energy = new MyEnergy(this.resource);
        energy.run();
        break;
      default:
        log.error("Unknown resource type: " + JSON.stringify(this.resource));
        break;
    }
  }
}
