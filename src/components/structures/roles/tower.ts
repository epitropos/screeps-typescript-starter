/**
 * Runs all tower actions.
 *
 * @export
 * @param {Tower} tower
 */
export function run(tower: Tower): void {
  let hostileCreeps = _loadHostileCreeps(tower.room);
  if (hostileCreeps.length > 0) {
    let weakestCreep = _getWeakestHostileCreep(hostileCreeps);
    tower.attack(weakestCreep);
  }

  let damagedStructures = _loadDamagedStructures(tower.room);
  if (damagedStructures.length > 0) {
    let mostDamagedStructure = _getMostDamagedStructure(damagedStructures);
    tower.repair(mostDamagedStructure);
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
