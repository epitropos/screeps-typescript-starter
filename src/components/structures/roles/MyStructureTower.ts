// import * as Config from "../../../config/config";
// import {log} from "../../../lib/logger/log";
import {MyStructureBuilding} from "./MyStructureBuilding";
import {RoomHandler} from "../../rooms/RoomHandler";

export class MyStructureTower extends MyStructureBuilding {
  public tower: Tower;

  constructor(tower: Tower, roomHandler: RoomHandler) {
    super(tower, roomHandler);
    this.tower = tower;
  }

  public run() {
    let hostileCreeps = this.loadHostileCreeps(this.tower.room);
    if (hostileCreeps.length > 0) {
      let weakestCreep = this.getWeakestHostileCreep(hostileCreeps);
      this.tower.attack(weakestCreep);
      return;
    }

    let structures = this.tower.room.find<Structure>(FIND_MY_STRUCTURES, {
      filter: (s: Structure) => s.hits < s.hitsMax,
    });
    if (structures.length > 0) {
      let structure = this.tower.pos.findClosestByRange<Structure>(structures);
      this.tower.repair(structure);
      return;
    }
  }

  private getWeakestHostileCreep(creeps: Creep[]) {
    let weakestCreep: Creep = creeps[0];
    _.each(creeps, (creep: Creep) => {
      if (creep.hits < weakestCreep.hits) {
        weakestCreep = creep;
      }
    });
    return weakestCreep;
  }

  private loadHostileCreeps(room: Room): Creep[] {
    return room.find<Creep>(FIND_HOSTILE_CREEPS);
  }
}
