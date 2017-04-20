/**
 * Runs all tower actions.
 *
 * @export
 * @param {Tower} tower
 */
export function run(tower: Tower): void {
  let hostileCreeps = tower.room.find<Creep>(FIND_HOSTILE_CREEPS);
  let damagedCreeps = tower.room.find<Creep>(FIND_MY_CREEPS, {filter: (c: Creep) => c.hits < c.hitsMax});
  let damagedStructures = tower.room.find<Structure>(FIND_MY_STRUCTURES, {filter: (s: Structure) => s.hits < s.hitsMax});

  if (hostileCreeps.length > 0) {
    _tryAttack(tower, hostileCreeps);
  } else if (damagedCreeps.length > 0) {
    // TODO: Heal damaged units.
  } else if (damagedStructures.length > 0) {
    // TODO: Repair damaged structures.
  }
}

// TODO: Set return if there is one?
function _tryAttack(tower: Tower, hostileCreeps: Creep[]) {
    let hostileCreep = tower.pos.findClosestByRange(hostileCreeps);
    tower.attack(hostileCreep);

}
