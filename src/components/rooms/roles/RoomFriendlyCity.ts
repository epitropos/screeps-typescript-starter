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

    // TODO: Change instantiation to parameter.
    let creepPopulationHandler = new CreepPopulationHandler(new RoomHandler(this.room));
    creepPopulationHandler.run();

    // TODO: Move this code into RoomOwned.
    let creeps = this.room.find(FIND_MY_CREEPS);
    // log.info("Creeps found: " + creeps.length);
    _.forEach(creeps, function(creep: Creep) {
      if (creep) {
        let creepHandler = new CreepHandler(creep);
        creepHandler.run();
      }
    });

    // TODO: Move this code into RoomOwned.
    let structures = this.room.find(FIND_MY_STRUCTURES);
    // log.info("Structures found: " + creeps.length);
    _.forEach(structures, function(structure: Structure) {
      if (structure) {
        let structureHandler = new StructureHandler(structure);
        structureHandler.run();
      }
    });
  }
}