// import * as Config from "../../config/config";
import { log } from "../../lib/logger/log";
import { MineralHandler } from "../minerals/MineralHandler";
import { ResourceHandler } from "../resources/ResourceHandler";
import { SourceHandler } from "../sources/SourceHandler";
// import { StructureHandler } from "../structures/StructureHandler";

export class RoomHandler {
  public static InitializeMemory() {
    // TODO: Code goes here.
  }

  public room: Room;

  constructor (room: Room) {
    this.room = room;
  }

  public run() {
    log.info("Process friendly room: " + this.room.name);
    this.processResources(this.room);
    this.processSources(this.room);
    this.processMinerals(this.room);
    // this.processSpawns(this.room);
  }

  private processMinerals(room: Room)
  {
    let minerals = room.find<Mineral>(FIND_MINERALS);
    for (let mineral of minerals) {
      // TODO: Consider removing handler and using factory and embedding run inside a Mineral wrapper.
      let mineralHandler = new MineralHandler(mineral);
      mineralHandler.run();
    }
  }
  private processResources(room: Room)
  {
    let resources = room.find<Resource>(FIND_DROPPED_RESOURCES);
    for (let resource of resources) {
      // TODO: Consider removing handler and using factory and embedding run inside a Resource wrapper.
      let resourceHandler = new ResourceHandler(resource);
      resourceHandler.run();
    }
  }

  private processSources(room: Room)
  {
    let sources = room.find<Source>(FIND_SOURCES);
    for (let source of sources) {
      // TODO: Consider removing handler and using factory and embedding run inside a Source wrapper.
      let sourceHandler = new SourceHandler(source);
      sourceHandler.run();
    }
  }

  // private processSpawns(room: Room)
  // {
  //   let spawns = room.find(FIND_MY_SPAWNS);
  //   if (spawns.length > 0) {
  //   }
  // }
}
