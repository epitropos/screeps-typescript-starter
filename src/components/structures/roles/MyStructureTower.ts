import * as Config from "../../../config/config";
// import {log} from "../../../lib/logger/log";
import {MyStructureBase} from "./MyStructureBase";
import {RoomHandler} from "../../rooms/RoomHandler";

export class MyStructureTower extends MyStructureBase {
  public tower: Tower;
  public roomHandler: RoomHandler;

  constructor(tower: Tower, roomHandler: RoomHandler) {
    super(tower, roomHandler);
    this.tower = tower;
  }

  public run() {
    let hostileCreeps = this.loadHostileCreeps(this.tower.room);
    if (Config.ENABLE_DEBUG_MODE) {
      // log.info("# of hostiles: " + hostileCreeps.length);
    }
    if (hostileCreeps.length > 0) {
      let weakestCreep = this.getWeakestHostileCreep(hostileCreeps);
      if (Config.ENABLE_DEBUG_MODE) {
        // log.info("Attacking: " + weakestCreep.name + " at (" + weakestCreep.pos.x + "," + weakestCreep.pos.y + ")");
      }
      this.tower.attack(weakestCreep);
      return;
    }

    let damagedStructures = this.loadDamagedStructures(this.tower.room);
    // log.info("# of damaged structures: " + damagedStructures.length);
    if (damagedStructures.length > 0) {
      // let mostDamagedStructure = _getMostDamagedStructure(damagedStructures);
      // log.info("Most damaged structure: "
      // + mostDamagedStructure.structureType
      // + " at (" + mostDamagedStructure.pos.x + "," + mostDamagedStructure.pos.y + ")");
      // tower.repair(mostDamagedStructure);
      return;
    }

    let structures = this.tower.room.find<Structure>(FIND_MY_STRUCTURES, {
      filter: (s: Structure) => s.hits < s.hitsMax
    });
    if (Config.ENABLE_DEBUG_MODE) {
      // log.info("Damaged structures: " + structures.length);
    }
    if (structures.length > 0) {
      let structure = this.tower.pos.findClosestByRange<Structure>(structures);
      if (Config.ENABLE_DEBUG_MODE) {
        // log.info("Tower repairing: " + structure.structureType
        //   + " at (" + structure.pos.x + "," + structure.pos.y + ")");
      }
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

  // function _getMostDamagedStructure(structures: Structure[]): Structure {
  //   let mostDamagedStructure = structures[0];
  //   _.each(structures, (structure: Structure) => {
  //     if (structure.hits < mostDamagedStructure.hits) {
  //       mostDamagedStructure = structure;
  //     }
  //   });
  //   return mostDamagedStructure;
  // }

  private loadDamagedStructures(room: Room): Structure[] {
    return room.find<Structure>(FIND_STRUCTURES,
    // {filter: (s: Structure) => (s.structureType !== STRUCTURE_WALL && s.hits < s.hitsMax)
    //   || (s.structureType === STRUCTURE_WALL && s.hits < 100000)}
    {filter: (s: Structure) => s.hits < s.hitsMax}
    );
  }

  // private needsEnergy(structure: Tower): boolean {
  //   return structure.energy < structure.energyCapacity;
  // }
}
