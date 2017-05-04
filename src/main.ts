import * as Config from "./config/config";
import { log } from "./lib/logger/log";
// import * as CreepManager from "./components/creeps/creepManager";
// import * as GameMapManager from "./components/gameMapManager";
// import * as RoomManager from "./components/rooms/roomManager";
// import * as StructureManager from "./components/structures/structureManager";
import {MessageHandler} from "./components/messages/MessageHandler";

import {GameHandler} from "./components/game/GameHandler";
import {RoomHandler} from "./components/rooms/RoomHandler";

// Any code written outside the `loop()` method is executed only when the
// Screeps system reloads your script.
// Use this bootstrap wisely. You can cache some of your stuff to save CPU.
// You should extend prototypes before the game loop executes here.

// This is an example for using a config variable from `config.ts`.
if (Config.USE_PATHFINDER) {
  PathFinder.use(true);
}

initializeMemory();

/**
 * Screeps system expects this "loop" method in main.js to run the
 * application. If we have this line, we can be sure that the globals are
 * bootstrapped properly and the game loop is executed.
 * http://support.screeps.com/hc/en-us/articles/204825672-New-main-loop-architecture
 *
 * @export
 */
export function loop() {
  log.info("##################################################");
  // Check memory for null or out of bounds custom objects
  if (!Memory.uuid || Memory.uuid > 100) {
    Memory.uuid = 0;
  }

  let messageHandler = new MessageHandler();
  log.info("messageHandler: " + messageHandler);
  messageHandler.test();

  let gameHandler = new GameHandler(Game);
  gameHandler.run();

  for (let roomName in Game.rooms) {
    let room = Game.rooms[roomName];
    let roomHandler = new RoomHandler(room);
    roomHandler.run();
  }

  // for (let i in Game.rooms) {
  //   // let room: Room = Game.rooms[i];

  //   // GameMapManager.run();
  //   // RoomManager.run(room); // TODO: Move into GameMapManager.
  //   // StructureManager.run(room); // TODO: Move into RoomManager.
  //   // CreepManager.run(room); // TODO: Move into RoomManager.

  //   // // Clears any non-existing creep memory.
  //   // for (let name in Memory.creeps) {
  //   //   let creep: any = Memory.creeps[name];

  //   //   if (creep.room === room.name) {
  //   //     if (!Game.creeps[name]) {
  //   //       // log.info("Clearing non-existing creep memory:", name);
  //   //       delete Memory.creeps[name];
  //   //     }
  //   //   }
  //   // }
  // }

  for (let i in Memory.creeps) {
    if (!Game.creeps[i]) {
        delete Memory.creeps[i];
    }
  }
}

function initializeMemory() {
  initializeMemoryConfig(); // TODO: Move this into the appropriate location.
  initializeMemoryConfigDefaults(); // TODO: Move this into the appropriate location.
  initializeMemoryConfigDefaultsPopulation(); // TODO: Move this into the appropriate location.
  MessageHandler.InitializeMemory(); // TODO: Consider this for the style of the appropriate location.
}

function initializeMemoryConfig() {
  if (!Memory.config) {
    Memory.config = {};
  }
}

function initializeMemoryConfigDefaults() {
  if (!Memory.config.defaults) {
    Memory.config.defaults = {};
  }
}

function initializeMemoryConfigDefaultsPopulation() {
  if (!Memory.config.defaults.population) {
    Memory.config.defaults.population = {};
    Memory.config.defaults.population.maximums = {};
    Memory.config.defaults.population.maximums.builders = 1;
    Memory.config.defaults.population.maximums.haulers = 0;
    Memory.config.defaults.population.maximums.miners = 0;
    Memory.config.defaults.population.maximums.upgraders = 1;
  }
}
