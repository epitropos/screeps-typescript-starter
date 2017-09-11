// import * as Config from "../../config/config";
import { log } from "../../lib/logger/log";
// import { ResourceFactory } from "./ResourceFactory";
import { EnergyResource } from "./EnergyResource";

export class ResourceHandler {
  public resource: Resource;

  constructor (resource: Resource) {
    this.resource = resource;
  }

  public run() {
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
