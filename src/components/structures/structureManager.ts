// TODO: Change game loop so that structures make requests.
// TODO: Change game loop so creeps make requests (i.e. repair, energy, etc).

 import * as Config from "../../config/config";
 import { log } from "../../lib/logger/log";
import * as TowerHandler from "./roles/tower";

export let structures: Structure[] = [];
export let towers: Tower[] = [];

// export let hostileCreeps: Creep[];
// export let hostileCreepCount: number = 0;
// export let creeps: Creep[];
// export let creepCount: number = 0;

/**
 * Initialization scripts for StructureManager module.
 *
 * @export
 * @param {Room} room
 */
export function run(room: Room): void {
  /*
  _.each(structures, (structure: Structure) => {
    if (structure.structureType === STRUCTURE_TOWER) {
      if (Config.ENABLE_DEBUG_MODE) {
        log.info("Running tower at (" + structure.pos.x + "," + structure.pos.y + ")");
      }
      TowerHandler.run(<Tower> structure);
    }
  });
  */

  _runTowers(room);
}

/**
 * Loads and counts all towers.
 *
 * @param {Room} room
 */
function _loadTowers(room: Room) {
  towers = room.find<Tower>(FIND_MY_STRUCTURES, {filter: (s: Structure) => s.structureType === STRUCTURE_TOWER});
  if (Config.ENABLE_DEBUG_MODE) {
    log.info("Towers found: " + towers.length);
  }
}

function _runTowers(room: Room) {
  // towers = room.find<Tower>(FIND_MY_STRUCTURES, {filter: (s: Structure) => s.structureType === STRUCTURE_TOWER});
  _loadTowers(room);
  if (Config.ENABLE_DEBUG_MODE) {
    log.info("Towers found: " + towers.length);
  }

  _.each(towers, (tower: Tower) => {
    _runTower(tower);
  });
}

function _runTower(tower: Tower) {
    TowerHandler.run(tower);
}
