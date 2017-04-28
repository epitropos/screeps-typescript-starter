// import * as Config from "../../config/config";
// import {log} from "../../lib/logger/log";
import * as C from "../../config/constants";
import {RoomHandler} from "../rooms/RoomHandler";
import {CreepBuilder} from "./roles/support/CreepBuilder";
// import {CreepHarvester} from "./roles/support/CreepHarvester";
import {CreepHauler} from "./roles/support/CreepHauler";
import {CreepMiner} from "./roles/support/CreepMiner";
import {CreepStocker} from "./roles/support/CreepStocker";
import {CreepUpgrader} from "./roles/support/CreepUpgrader";

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
      // case C.HARVESTER:
      //   let harvester = new CreepHarvester(this.creep, this.roomHandler);
      //   harvester.run();
      //   break;
      case C.HAULER:
        let hauler = new CreepHauler(this.creep, this.roomHandler);
        hauler.run();
        break;
      case C.MINER:
        let miner = new CreepMiner(this.creep, this.roomHandler);
        miner.run();
        break;
      case C.STOCKER:
        let stocker = new CreepStocker(this.creep, this.roomHandler);
        stocker.run();
        break;
      case C.UPGRADER:
        let upgrader = new CreepUpgrader(this.creep, this.roomHandler);
        upgrader.run();
        break;
      default:
        break;
    }
  }
}
