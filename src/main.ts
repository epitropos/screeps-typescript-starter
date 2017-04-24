import * as Config from "./config/config";
import { log } from "./lib/logger/log";
import * as CreepManager from "./components/creeps/creepManager";
import * as GameMapManager from "./components/gameMapManager";
// import * as RoomManager from "./components/rooms/roomManager";
import * as StructureManager from "./components/structures/structureManager";

// Any code written outside the `loop()` method is executed only when the
// Screeps system reloads your script.
// Use this bootstrap wisely. You can cache some of your stuff to save CPU.
// You should extend prototypes before the game loop executes here.

// This is an example for using a config variable from `config.ts`.
if (Config.USE_PATHFINDER) {
  PathFinder.use(true);
}

log.info("load");

/**
 * Screeps system expects this "loop" method in main.js to run the
 * application. If we have this line, we can be sure that the globals are
 * bootstrapped properly and the game loop is executed.
 * http://support.screeps.com/hc/en-us/articles/204825672-New-main-loop-architecture
 *
 * @export
 */
export function loop() {
  // Check memory for null or out of bounds custom objects
  if (!Memory.uuid || Memory.uuid > 100) {
    Memory.uuid = 0;
  }

  let gameHandler: GameHandler = new GameHandler(Game);
  gameHandler.run();

  let roomHandlers: RoomHandler[] = [];
  let rooms = Game.rooms;
  for (let roomName in rooms) {
    let roomHandler = new RoomHandler(Game.rooms[roomName]);
    roomHandlers.push(roomHandler);
  }

  for(let roomHandler in roomHandlers) {
    roomHandler.run();
  }


  for (let i in Game.rooms) {
    let room: Room = Game.rooms[i];

    GameMapManager.run();
    // RoomManager.run(room); // TODO: Move into GameMapManager.
    StructureManager.run(room); // TODO: Move into RoomManager.
    CreepManager.run(room); // TODO: Move into RoomManager.

    // Clears any non-existing creep memory.
    for (let name in Memory.creeps) {
      let creep: any = Memory.creeps[name];

      if (creep.room === room.name) {
        if (!Game.creeps[name]) {
          log.info("Clearing non-existing creep memory:", name);
          delete Memory.creeps[name];
        }
      }
    }
  }
}
