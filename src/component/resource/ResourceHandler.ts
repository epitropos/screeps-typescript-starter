// import * as Config from "../../config/config";
import { log } from "../../lib/logger/log";
// import { ResourceFactory } from "./ResourceFactory";
import { EnergyResource } from "./EnergyResource";

export class ResourceHandler {
  public resource: Resource;

  private debug: boolean = false;

  constructor (resource: Resource) {
    this.resource = resource;
  }

  public run() {
    if (this.debug) {
      log.info(this.resource.id + " - ResourceHandler.run");
    }

    switch (this.resource.resourceType) {
      case RESOURCE_ENERGY:
        let energy = new EnergyResource(this.resource);
        energy.run();
        break;
      default:
        log.error("Unknown resource type: " + JSON.stringify(this.resource));
        break;
    }
  }
}
