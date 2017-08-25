import * as Config from "./config/config";
import { log } from "./lib/logger/log";
import {Initialize} from "./Initialize";
import {GameHandler} from "./components/game/GameHandler";
import {RoomHandler} from "./components/rooms/RoomHandler";

// Remove logging fluff.
log.showSource = false;
log.showTick = false;

// This is an example for using a config variable from `config.ts`.
if (Config.USE_PATHFINDER) {
  PathFinder.use(true);
}

// initializeMemory();
Initialize.InitializeMemory();

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

  log.info("Process game");
  runGameHandler(Game);

  log.info("Process rooms");
  runRoomHandler(Game.rooms);

  log.info("Delete dead creeps from memory");
  deleteDeadCreeps(Game, Memory);

  log.info("CPU usage");
  displayCpuUsage(Game.cpu);
}

function deleteDeadCreeps(game: Game, memory: Memory) {
  for (let i in memory.creeps) {
    if (!game.creeps[i]) {
        delete memory.creeps[i];
    }
  }
}

function displayCpuUsage(cpu: CPU) {
  log.info("CPU used: " + _.round(cpu.getUsed(), 1)
  + " | Bucket: " + cpu.bucket
  + " | Limit: " + cpu.limit
  + " | TickLimit: " + cpu.tickLimit);
}

function runGameHandler(game: Game) {
  let gameHandler = new GameHandler(game);
  gameHandler.run();
}

function runRoomHandler(rooms: {[roomName: string]: Room}) {
  for (let roomName in rooms) {
    let room = rooms[roomName];
    let roomHandler = new RoomHandler(room);
    roomHandler.run();
  }
}
