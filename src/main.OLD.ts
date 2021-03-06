// import * as Config from "./config/config";
// import { log } from "./lib/logger/log";
// // import * as CreepManager from "./components/creeps/creepManager";
// // import * as GameMapManager from "./components/gameMapManager";
// // import * as RoomManager from "./components/rooms/roomManager";
// // import * as StructureManager from "./components/structures/structureManager";
// import {Initialize} from "./Initialize";
// // import {MessageHandler} from "./components/messages/MessageHandler";

// import {GameHandler} from "./components/game/GameHandler";
// import {RoomHandler} from "./components/rooms/RoomHandler";

// // Remove logging fluff.
// log.showSource = false;
// log.showTick = false;

// // Any code written outside the `loop()` method is executed only when the
// // Screeps system reloads your script.
// // Use this bootstrap wisely. You can cache some of your stuff to save CPU.
// // You should extend prototypes before the game loop executes here.

// // This is an example for using a config variable from `config.ts`.
// if (Config.USE_PATHFINDER) {
//   PathFinder.use(true);
// }

// // initializeMemory();
// Initialize.InitializeMemory();

// // TODO: Load room buildings into memory.

// /**
//  * Screeps system expects this "loop" method in main.js to run the
//  * application. If we have this line, we can be sure that the globals are
//  * bootstrapped properly and the game loop is executed.
//  * http://support.screeps.com/hc/en-us/articles/204825672-New-main-loop-architecture
//  *
//  * @export
//  */
// export function loop() {
//   log.info("##################################################");
//   // Check memory for null or out of bounds custom objects
//   if (!Memory.uuid || Memory.uuid > 100) {
//     Memory.uuid = 0;
//   }

//   // let messageHandler = new MessageHandler();
//   // // log.info("messageHandler: " + messageHandler);
//   // messageHandler.testSend();
//   // let message = messageHandler.testReceive(MessageHandler.MESSAGE_TYPE_CLONE_CREEP);
//   // if (message === undefined) {
//   //   // log.info("MESSAGE: undefined");
//   // } else {
//   //   // log.info("MESSAGE: " + JSON.stringify(message));
//   // }

//   let gameHandler = new GameHandler(Game);
//   gameHandler.run();

//   log.info("Process rooms");
//   for (let roomName in Game.rooms) {
//     let room = Game.rooms[roomName];
//     let roomHandler = new RoomHandler(room);
//     roomHandler.run();
//   }

//   log.info("Delete dead creeps from memory");
//   for (let i in Memory.creeps) {
//     if (!Game.creeps[i]) {
//         delete Memory.creeps[i];
//     }
//   }

//   log.info("CPU used: " + _.round(Game.cpu.getUsed(), 1)
//     + " | Bucket: " + Game.cpu.bucket
//     + " | Limit: " + Game.cpu.limit
//     + " | TickLimit: " + Game.cpu.tickLimit);
// }

// // function initializeMemory() {
// //   initializeMemoryConfig(); // TODO: Move this into the appropriate location.
// //   initializeMemoryConfigDefaults(); // TODO: Move this into the appropriate location.
// //   initializeMemoryConfigDefaultsPopulation(); // TODO: Move this into the appropriate location.
// //   MessageHandler.InitializeMemory(); // TODO: Consider this for the style of the appropriate location.
// // }

// // function initializeMemoryConfig() {
// //   if (!Memory.config) {
// //     Memory.config = {};
// //   }
// // }

// // function initializeMemoryConfigDefaults() {
// //   if (!Memory.config.defaults) {
// //     Memory.config.defaults = {};
// //   }
// // }

// // function initializeMemoryConfigDefaultsPopulation() {
// //   if (!Memory.config.defaults.population) {
// //     Memory.config.defaults.population = {};
// //     Memory.config.defaults.population.maximums = {};
// //     Memory.config.defaults.population.maximums.builders = 1;
// //     Memory.config.defaults.population.maximums.haulers = 0;
// //     Memory.config.defaults.population.maximums.miners = 0;
// //     Memory.config.defaults.population.maximums.upgraders = 1;
// //   }
// // }
