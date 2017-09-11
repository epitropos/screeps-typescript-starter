// import * as Config from "../../config/config";
import { log } from "../../lib/logger/log";
// import { CreepHandler } from "../creep/CreepHandler";
// import { MineralHandler } from "../mineral/MineralHandler";
// import { ResourceHandler } from "../resource/ResourceHandler";
// import { SourceHandler } from "../source/SourceHandler";
// import { StructureHandler } from "../structure/StructureHandler";

export class EnemyColonyRoom {
  public room: Room;

  constructor (room: Room) {
    this.room = room;
  }

  public run() {
    log.info("Process room: " + this.room.name);

    this.initializeMemory();
    this.loadFromMemory();

    this.processResources(this.room);
    this.processSources(this.room);
    this.processMinerals(this.room);
    this.processStructures(this.room);
    this.processCreeps(this.room);

    this.saveToMemory();
  }

  private initializeMemory() {
    // TODO: Code goes here.
  }

  private loadFromMemory() {
    // TODO: Code goes here.
  }

  private saveToMemory() {
    // TODO: Code goes here.
  }

    private processCreeps(room: Room) {
    room.name = room.name;
    // let creeps = room.find<Creep>(FIND_MY_CREEPS);
    // for (let creep of creeps) {
    //   let creepHandler = new CreepHandler(creep);
    //   creepHandler.run();
    // }
  }

  private processMinerals(room: Room) {
    room.name = room.name;
    // let minerals = room.find<Mineral>(FIND_MINERALS);
    // for (let mineral of minerals) {
    //   // TODO: Consider removing handler and using factory and embedding run inside a Mineral wrapper.
    //   let mineralHandler = new MineralHandler(mineral);
    //   mineralHandler.run();
    // }
  }
  private processResources(room: Room) {
    room.name = room.name;
    // let resources = room.find<Resource>(FIND_DROPPED_RESOURCES);
    // for (let resource of resources) {
    //   // TODO: Consider removing handler and using factory and embedding run inside a Resource wrapper.
    //   let resourceHandler = new ResourceHandler(resource);
    //   resourceHandler.run();
    // }
  }

  private processSources(room: Room) {
    room.name = room.name;
    // let sources = room.find<Source>(FIND_SOURCES);
    // for (let source of sources) {
    //   // TODO: Consider removing handler and using factory and embedding run inside a Source wrapper.
    //   let sourceHandler = new SourceHandler(source);
    //   sourceHandler.run();
    // }
  }

  private processStructures(room: Room) {
    room.name = room.name;
    // let structures = room.find<Structure>(FIND_MY_STRUCTURES);
    // for (let structure of structures) {
    //   // TODO: Consider removing handler and using factory and embedding run inside a Structure wrapper.
    //   let structureHandler = new StructureHandler(structure);
    //   structureHandler.run();
    // }
  }
}
