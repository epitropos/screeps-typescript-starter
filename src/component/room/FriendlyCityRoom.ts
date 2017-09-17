// import * as Config from "../../config/config";
import { log } from "../../lib/logger/log";
import { CreepHandler } from "../creep/CreepHandler";
import { MineralHandler } from "../mineral/MineralHandler";
import { ResourceHandler } from "../resource/ResourceHandler";
import { SourceHandler } from "../source/SourceHandler";
import { StructureHandler } from "../structure/StructureHandler";

export class FriendlyCityRoom {
  public room: Room;

  private debug: boolean = false;

  constructor (room: Room) {
    this.room = room;
  }

  public run() {
    if (this.debug) {
      log.info(this.room.name + " - FriendlyCityRoom.run");
    }

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
    if (this.debug) {
      log.info(this.room.name + " - FriendlyCityRoom.processCreeps");
    }

    let creeps = room.find<Creep>(FIND_MY_CREEPS);
    for (let creep of creeps) {
      let creepHandler = new CreepHandler(creep);
      creepHandler.run();
    }
  }

  private processMinerals(room: Room) {
    if (this.debug) {
      log.info(this.room.name + " - FriendlyCityRoom.processMinerals");
    }

    let minerals = room.find<Mineral>(FIND_MINERALS);
    for (let mineral of minerals) {
      let mineralHandler = new MineralHandler(mineral);
      mineralHandler.run();
    }
  }
  private processResources(room: Room) {
    if (this.debug) {
      log.info(this.room.name + " - FriendlyCityRoom.processResources");
    }

    let resources = room.find<Resource>(FIND_DROPPED_RESOURCES);
    for (let resource of resources) {
      let resourceHandler = new ResourceHandler(resource);
      resourceHandler.run();
    }
  }

  private processSources(room: Room) {
    if (this.debug) {
      log.info(this.room.name + " - FriendlyCityRoom.processSources");
    }

    let sources = room.find<Source>(FIND_SOURCES);
    for (let source of sources) {
      let sourceHandler = new SourceHandler(source);
      sourceHandler.run();
    }
  }

  private processStructures(room: Room) {
    if (this.debug) {
      log.info(this.room.name + " - FriendlyCityRoom.processStructures");
    }

    let structures = room.find<Structure>(FIND_MY_STRUCTURES);
    for (let structure of structures) {
      let structureHandler = new StructureHandler(structure);
      structureHandler.run();
    }
  }
}
