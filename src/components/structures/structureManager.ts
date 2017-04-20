// TODO: Change game loop so that structures make requests.
// TODO: Change game loop so creeps make requests (i.e. repair, energy, etc).

// import * as Config from "../../config/config";
// import { log } from "../../lib/logger/log";
import * as tower from "./roles/tower";

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
  _loadTowers(room);

  _.each(structures, (structure: Structure) => {
    if (structure.structureType === STRUCTURE_TOWER) {
      tower.run(<Tower>structure);
    }
  });
}

/**
 * Loads and counts all towers.
 *
 * @param {Room} room
 */
function _loadTowers(room: Room) {
  towers = room.find<Tower>(FIND_MY_STRUCTURES, {filter: (s: Structure) => s.structureType === STRUCTURE_TOWER});
}
