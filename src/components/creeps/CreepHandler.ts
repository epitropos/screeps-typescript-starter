// import * as Config from "../../config/config";
// import {log} from "../../lib/logger/log";
import * as C from "../../config/constants";
import {RoomHandler} from "../rooms/RoomHandler";
import {CreepBuilder} from "./roles/support/CreepBuilder";
import {CreepHarvester} from "./roles/support/CreepHarvester";

export class CreepHandler {
  public readonly creep: Creep;
  public readonly roomHandler: RoomHandler;

  constructor (creep: Creep) {
    this.creep = creep;
    this.roomHandler = new RoomHandler(creep.room);
  }

  public run() {
    // log.info("Processing creep: " + this.creep.name);

    let creepRole = this.creep.memory.role;
    // log.warning("creep: " + this.creep.name + " has a role of " + creepRole);
    switch (creepRole) {
      case C.BUILDER:
        let builder = new CreepBuilder(this.creep, this.roomHandler);
        builder.run();
        break;
      case C.HARVESTER:
        let harvester = new CreepHarvester(this.creep, this.roomHandler);
        harvester.run();
        break;
      default:
        break;
    }
  }
}
