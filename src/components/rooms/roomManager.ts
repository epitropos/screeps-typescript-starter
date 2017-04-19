import * as Config from "../../config/config";

import { log } from "../../lib/logger/log";

/**
 * Initialization scripts for CreepManager module.
 *
 * @export
 * @param {Room} room
 */
export function run(room: Room): void {
  if (Config.ENABLE_DEBUG_MODE) {
    log.info("Loading room: " + room.name);
  }

  /*
  _loadCreeps(room);
  _buildMissingCreeps(room);

  _.each(creeps, (creep: Creep) => {
    if (creep.memory.role === "harvester") {
      harvester.run(creep);
    }
  });
  */
}
