import * as Config from "../../../config/config";
import { log } from "../../../lib/logger/log";

/**
 * Runs all tower actions.
 *
 * @export
 * @param {Tower} tower
 */
export function run(tower: Tower): void {
  /*
  let hostileCreeps = tower.room.find<Creep>(FIND_HOSTILE_CREEPS);
  let damagedCreeps = tower.room.find<Creep>(FIND_MY_CREEPS, {filter: (c: Creep) => c.hits < c.hitsMax});
  let damagedStructures = tower.room.find<Structure>(FIND_MY_STRUCTURES,
  {filter: (s: Structure) => s.hits < s.hitsMax});

  if (hostileCreeps.length > 0) {
    _tryAttack(tower, hostileCreeps);
  } else if (damagedCreeps.length > 0) {
    // TODO: Heal damaged units.
  } else if (damagedStructures.length > 0) {
    // TODO: Repair damaged structures.
  }
  */
  let closestHostileCreep = tower.pos.findClosestByRange<Creep>(FIND_HOSTILE_CREEPS);
  if (closestHostileCreep) {
    if (Config.ENABLE_DEBUG_MODE) {
      log.info("Tower attacking hostile creep: " + closestHostileCreep.name
      + " at (" + closestHostileCreep.pos.x + "," + closestHostileCreep.pos.y + ")");
    }
    tower.attack(closestHostileCreep);
  }

  let closestDamagedStructure = tower.pos.findClosestByRange<Structure>(FIND_STRUCTURES,
  {filter: (structure: Structure) => structure.hits < structure.hitsMax});
  if (closestDamagedStructure) {
    if (Config.ENABLE_DEBUG_MODE) {
      log.info("Tower repairing structures: " + closestDamagedStructure.structureType
      + " at (" + closestDamagedStructure.pos.x + "," + closestDamagedStructure.pos.y + ")");
    }
    tower.repair(closestDamagedStructure);
  }
}

/*
// TODO: Set return if there is one?
function _tryAttack(tower: Tower, hostileCreeps: Creep[]) {
    let hostileCreep = tower.pos.findClosestByRange(hostileCreeps);
    tower.attack(hostileCreep);

}
*/

/*
    var tower = Game.getObjectById('d8d5acdad7f19c8f20b4b070');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }
*/
