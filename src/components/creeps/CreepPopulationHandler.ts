// import * as Config from "../../config/config";
import {log} from "../../lib/logger/log";
import {RoomHandler} from "../rooms/RoomHandler";

export class CreepPopulationHandler {
  public roomHandler: RoomHandler;

  constructor(roomHandler: RoomHandler) {
    this.roomHandler = roomHandler;
  }

  public run() {
    this.buildMissingCreep(this.roomHandler);
  }

  public buildMissingCreep(roomHandler: RoomHandler) {
    // TODO: Change this to watch requests for a role that are not being taken.

    let room = roomHandler.room;
    let spawns = room.find<Spawn>(FIND_MY_SPAWNS);
    let spawn = spawns[0]; // TODO: Pick a spawn with a better mechanism than this.

    let harvesters = room.find(FIND_MY_CREEPS, {filter: (c: Creep) => c.memory.role === "harvester"});
    let maxHarvesters = this.numberOfCreeps("harvester", room.energyCapacityAvailable);
    if (harvesters.length < maxHarvesters) {
      log.info("Creating harvester " + (harvesters.length + 1) + " of " + maxHarvesters);
      this.createCreep(spawn, "harvester", this.getBodyParts("harvester", room.energyCapacityAvailable));
      return;
    }
    // let miners = room.find(FIND_MY_CREEPS, {filter: (c: Creep) => c.memory.role === "miner"});
    // TODO: Add code to build miner.

    // let haulers = room.find(FIND_MY_CREEPS, {filter: (c: Creep) => c.memory.role === "hauler"});
    // TODO: Add code to build hauler.

    let builders = room.find(FIND_MY_CREEPS, {filter: (c: Creep) => c.memory.role === "builder"});
    let maxBuilders = this.numberOfCreeps("builder", room.energyCapacityAvailable);
    if (builders.length < maxBuilders) {
      log.info("Creating builder " + (builders.length + 1) + " of " + maxBuilders);
      this.createCreep(spawn, "harvester", this.getBodyParts("builder", room.energyCapacityAvailable));
      return;
    }

    let upgraders = room.find(FIND_MY_CREEPS, {filter: (c: Creep) => c.memory.role === "upgrader"});
    let maxUpgraders = this.numberOfCreeps("upgrader", room.energyCapacityAvailable);
    if (upgraders.length < maxUpgraders) {
      log.info("Creating upgrader " + (upgraders.length + 1) + " of " + maxUpgraders);
      this.createCreep(spawn, "upgrader", this.getBodyParts("upgrader", room.energyCapacityAvailable));
      return;
    }

    // let claimers = room.find(FIND_MY_CREEPS, {filter: (c: Creep) => c.memory.role === "claimer"});
    // TODO: Add code to build claimer.
  }

  public getBodyParts(creepRole: string, energyCapacity: number) {
    if (creepRole === "builder") {
      if (energyCapacity <= 300) { return [WORK, CARRY, MOVE]; }
      if (energyCapacity <= 400) { return [WORK, WORK, CARRY, MOVE]; }
      if (energyCapacity <= 500) { return [WORK, WORK, CARRY, MOVE, MOVE]; }
      if (energyCapacity <= 600) { return [WORK, WORK, WORK, CARRY, MOVE, MOVE]; }
      if (energyCapacity <= 700) { return [WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE]; }
      if (energyCapacity <= 800) { return [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE]; }
      if (energyCapacity <= 900) { return [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE]; }
      return [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
    }

    if (creepRole === "harvester") {
      if (energyCapacity <= 300) { return [WORK, CARRY, MOVE]; }
      if (energyCapacity <= 400) { return [WORK, WORK, CARRY, MOVE]; }
      if (energyCapacity <= 500) { return [WORK, WORK, CARRY, MOVE, MOVE]; }
      if (energyCapacity <= 600) { return [WORK, WORK, WORK, CARRY, MOVE, MOVE]; }
      if (energyCapacity <= 700) { return [WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE]; }
      if (energyCapacity <= 800) { return [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE]; }
      if (energyCapacity <= 900) { return [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE]; }
      return [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
    }

    if (creepRole === "upgrader") {
      if (energyCapacity <= 300) { return [WORK, CARRY, MOVE]; }
      if (energyCapacity <= 400) { return [WORK, WORK, CARRY, MOVE]; }
      if (energyCapacity <= 500) { return [WORK, WORK, CARRY, MOVE, MOVE]; }
      if (energyCapacity <= 600) { return [WORK, WORK, WORK, CARRY, MOVE, MOVE]; }
      if (energyCapacity <= 700) { return [WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE]; }
      if (energyCapacity <= 800) { return [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE]; }
      if (energyCapacity <= 900) { return [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE]; }
      return [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
    }

    return [WORK, CARRY, MOVE];
  }

  public createCreep(spawn: Spawn, creepRole: string, bodyParts: string[]) {
    let status = spawn.canCreateCreep(bodyParts, undefined);
    if (status === OK) {
      let uuid = Memory.uuid;
      Memory.uuid++;
      let creepName: string = spawn.room.name + "_" + creepRole + uuid;
      let status = spawn.createCreep(bodyParts, creepName, {role: creepRole});
      return _.isString(status) ? OK : status;
    }
  }

  public numberOfCreeps(creepRole: string, energyCapacity: number) {
    // TODO: Move this data into Memory.config.defaults.

    if (energyCapacity <= 300) {
      switch (creepRole) {
        case "builder": return 1;
        case "harvester": return 1;
        default: return 0;
      }
    }

    if (energyCapacity <= 400) {
      switch (creepRole) {
        case "builder": return 2;
        case "harvester": return 3;
        case "upgrader": return 1;
        default: return 0;
      }
    }

    if (energyCapacity <= 500) {
      switch (creepRole) {
        case "builder": return 2;
        case "harvester": return 4;
        case "upgrader": return 2;
        default: return 0;
      }
    }

    if (energyCapacity <= 600) {
      switch (creepRole) {
        case "builder": return 3;
        case "harvester": return 6;
        case "upgrader": return 3;
        default: return 0;
      }
    }

    if (energyCapacity <= 700) {
      switch (creepRole) {
        case "builder": return 3;
        case "harvester": return 6;
        case "upgrader": return 3;
        default: return 0;
      }
    }

    if (energyCapacity <= 800) {
      switch (creepRole) {
        case "builder": return 3;
        case "harvester": return 6;
        case "upgrader": return 3;
        default: return 0;
      }
    }

    switch (creepRole) {
      case "builder": return 3;
      case "harvester": return 6;
      // case "hauler": return 3;
      case "upgrader": return 3;
      default: return 0;
    }
  }
}
