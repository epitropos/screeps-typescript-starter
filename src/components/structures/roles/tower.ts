import * as Config from "../../../config/config";
import { log } from "../../../lib/logger/log";

/**
 * Runs all tower actions.
 *
 * @export
 * @param {Tower} tower
 */
export function run(tower: Tower): void {
  let hostileCreeps = _loadHostileCreeps(tower.room);
  if (Config.ENABLE_DEBUG_MODE) {
    log.info("# of hostiles: " + hostileCreeps.length);
  }
  if (hostileCreeps.length > 0) {
    let weakestCreep = _getWeakestHostileCreep(hostileCreeps);
    if (Config.ENABLE_DEBUG_MODE) {
      log.info("Tower attacking: " + weakestCreep.name + " at (" + weakestCreep.pos.x + "," + weakestCreep.pos.y + ")");
    }
    tower.attack(weakestCreep);
    return;
  }

  /*
  let damagedStructures = _loadDamagedStructures(tower.room);
  if (damagedStructures.length > 0) {
    let mostDamagedStructure = _getMostDamagedStructure(damagedStructures);
    tower.repair(mostDamagedStructure);
    return;
  }
  */

  let structures = tower.room.find<Structure>(FIND_MY_STRUCTURES, {filter: (s: Structure) => s.hits < s.hitsMax});
  if (Config.ENABLE_DEBUG_MODE) {
    log.info("Damaged structures: " + structures.length);
  }
  if (structures.length > 0) {
    let structure = tower.pos.findClosestByRange<Structure>(structures);
    if (Config.ENABLE_DEBUG_MODE) {
      log.info("Tower repairing: " + structure.structureType + " at (" + structure.pos.x + "," + structure.pos.y + ")");
    }
    tower.repair(structure);
    return;
  }
}

function _getWeakestHostileCreep(creeps: Creep[]) {
  let weakestCreep: Creep = creeps[0];
  _.each(creeps, (creep: Creep) => {
    if (creep.hits < weakestCreep.hits) {
      weakestCreep = creep;
    }
  });
  return weakestCreep;
}

function _loadHostileCreeps(room: Room): Creep[] {
  return room.find<Creep>(FIND_HOSTILE_CREEPS);
}

/*
function _getMostDamagedStructure(structures: Structure[]): Structure {
  let mostDamagedStructure = structures[0];
  _.each(structures, (structure: Structure) => {
    if (structure.hits < mostDamagedStructure.hits) {
      mostDamagedStructure = structure;
    }
  });
  return mostDamagedStructure;
}

function _loadDamagedStructures(room: Room): Structure[] {
  return room.find<Structure>(FIND_MY_STRUCTURES, {filter: (s: Structure) => s.hits < s.hitsMax});
}
*/
