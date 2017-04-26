// TODO: Change game loop so that rooms make requests (This includes enemy rooms requesting conquering or quarantining).

import * as Config from "../../config/config";
// import * as C from "../../config/constants";
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
    if (creep.memory.role === C.HARVESTER) {
      harvester.run(creep);
    }
  });
  */
}
