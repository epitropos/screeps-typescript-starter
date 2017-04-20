// TODO: Change game loop so that structures make requests.
// TODO: Change game loop so creeps make requests (i.e. repair, energy, etc).

import * as TowerHandler from "./roles/tower";

/**
 * Initialization scripts for StructureManager module.
 *
 * @export
 * @param {Room} room
 */
export function run(room: Room): void {
  _runTowers(room);
}

/**
 * Loads and counts all towers.
 *
 * @param {Room} room
 */
function _loadTowers(room: Room): Tower[] {
  return room.find<Tower>(FIND_MY_STRUCTURES, {filter: (s: Structure) => s.structureType === STRUCTURE_TOWER});
}

/**
 * Runs the process for each tower.
 * @param {Room} room
 */
function _runTowers(room: Room) {
  let towers = _loadTowers(room);
  _.each(towers, (tower: Tower) => {
    _runTower(tower);
  });
}

/**
 * Runs the process for a tower.
 * @param {Tower} tower
 */
function _runTower(tower: Tower) {
  TowerHandler.run(tower);
}
