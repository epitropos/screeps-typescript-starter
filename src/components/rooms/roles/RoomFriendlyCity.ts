import {CreepHandler} from "../../creeps/CreepHandler";
import {CreepPopulationHandler} from "../../creeps/CreepPopulationHandler";
import {RoomFriendly} from "./RoomFriendly";
import {RoomHandler} from "../RoomHandler";
import {StructureHandler} from "../../structures/StructureHandler";

export class RoomFriendlyCity extends RoomFriendly {
  constructor(room: Room) {
    super(room);
  }

  public run() {
    super.run();

    // Clear source containerIds and minerIds if no longer extant.
    let sourceIds = this.room.memory.sources;
    for (let sourceId in sourceIds) {
      let containerId = this.room.memory.sources[sourceId].containerId;
      let container = Game.getObjectById(containerId);
      if (!container) {
        this.room.memory.sources[sourceId].containerId = undefined;
      }

      let minerId = this.room.memory.sources[sourceId].minerId;
      let miner = Game.getObjectById(minerId);
      if (!miner) {
        this.room.memory.sources[sourceId].minerId = undefined;
      }
    }

    // TODO: Change instantiation to parameter.
    let creepPopulationHandler = new CreepPopulationHandler(new RoomHandler(this.room));
    creepPopulationHandler.run();

    // TODO: Move this code into RoomOwned.
    let creeps = this.room.find(FIND_MY_CREEPS);
    _.forEach(creeps, function(creep: Creep) {
      if (creep) {
        let creepHandler = new CreepHandler(creep);
        creepHandler.run();
      }
    });

    // TODO: Move this code into RoomOwned.
    let structures = this.room.find(FIND_MY_STRUCTURES);
    _.forEach(structures, function(structure: Structure) {
      if (structure) {
        let structureHandler = new StructureHandler(structure);
        structureHandler.run();
      }
    });
  }
}
