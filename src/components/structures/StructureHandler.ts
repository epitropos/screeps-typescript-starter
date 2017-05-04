// import * as Config from "../../config/config";
// import {log} from "../../lib/logger/log";
import {RoomHandler} from "../rooms/RoomHandler";
import {MyStructureTower} from "./roles/MyStructureTower";

export class StructureHandler {
  public readonly structure: Structure;
  public readonly roomHandler: RoomHandler;

  constructor (structure: Structure) {
    this.structure = structure;
    this.roomHandler = new RoomHandler(structure.room);
  }

  public run() {
    switch (this.structure.structureType) {
      case STRUCTURE_TOWER:
        let tower = new MyStructureTower(<Tower> this.structure, this.roomHandler);
        tower.run();
        break;
      // case C.HAULER:
      //   let hauler = new CreepHauler(this.creep, this.roomHandler);
      //   hauler.run();
      //   break;
      // case C.MINER:
      //   let miner = new CreepMiner(this.creep, this.roomHandler);
      //   miner.run();
      //   break;
      // case C.STOCKER:
      //   let stocker = new CreepStocker(this.creep, this.roomHandler);
      //   stocker.run();
      //   break;
      // case C.UPGRADER:
      //   let upgrader = new CreepUpgrader(this.creep, this.roomHandler);
      //   upgrader.run();
      //   break;
      default:
        break;
    }
  }
}
