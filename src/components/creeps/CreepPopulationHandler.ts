// import * as Config from "../../config/config";
import * as C from "../../config/constants";
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
    // TODO: Consider changing this to watch requests for a role that are not being taken.


    let room = roomHandler.room;
    let spawns = room.find<Spawn>(FIND_MY_SPAWNS);
    let spawn = spawns[0]; // TODO: Pick a spawn with a better mechanism than this.

    if (spawn.spawning) {
      return;
    }

    let creeps = room.find<Creep>(FIND_MY_CREEPS);
    let harvesters = _.filter(creeps, (creep) => creep.memory.role === C.HARVESTER);
    let builders = _.filter(creeps, (creep) => creep.memory.role === C.BUILDER);
    let upgraders = _.filter(creeps, (creep) => creep.memory.role === C.UPGRADER);

    // let harvesters = room.find(FIND_MY_CREEPS, {filter: (c: Creep) => c.memory.role === C.HARVESTER});
    let maxHarvesters = this.numberOfCreeps(C.HARVESTER, room.energyAvailable);
    // let maxHarvesters = 6;
    if (harvesters.length < maxHarvesters) {
      let bodyParts = this.getBodyParts(C.HARVESTER, room.energyAvailable);
      let result = spawn.canCreateCreep(bodyParts);
      if (result !== OK) {
        return;
      }
      log.info("Creating harvester " + (harvesters.length + 1) + " of " + maxHarvesters);
      this.createCreep(spawn, C.HARVESTER, bodyParts);
      return;
    }

    // let miners = room.find(FIND_MY_CREEPS, {filter: (c: Creep) => c.memory.role === C.MINER});
    // TODO: Add code to build miner.

    // let haulers = room.find(FIND_MY_CREEPS, {filter: (c: Creep) => c.memory.role === C.HAULER});
    // TODO: Add code to build hauler.

    // let builders = room.find(FIND_MY_CREEPS, {filter: (c: Creep) => c.memory.role === C.BUILDER});
    let maxBuilders = this.numberOfCreeps(C.BUILDER, room.energyAvailable);
    // let maxBuilders = 3;
    if (builders.length < maxBuilders) {
      let bodyParts = this.getBodyParts(C.BUILDER, room.energyAvailable);
      let result = spawn.canCreateCreep(bodyParts);
      if (result !== OK) {
        return;
      }
      log.info("Creating builder " + (builders.length + 1) + " of " + maxBuilders);
      this.createCreep(spawn, C.BUILDER, bodyParts);
      return;
    }

    // let upgraders = room.find(FIND_MY_CREEPS, {filter: (c: Creep) => c.memory.role === C.UPGRADER});
    let maxUpgraders = this.numberOfCreeps(C.UPGRADER, room.energyAvailable);
    // let maxUpgraders = 3;
    if (upgraders.length < maxUpgraders) {
      let bodyParts = this.getBodyParts(C.UPGRADER, room.energyAvailable);
      let result = spawn.canCreateCreep(bodyParts);
      if (result !== OK) {
        return;
      }
      log.info("Creating upgrader " + (upgraders.length + 1) + " of " + maxUpgraders);
      this.createCreep(spawn, C.UPGRADER, bodyParts);
      return;
    }

    // let claimers = room.find(FIND_MY_CREEPS, {filter: (c: Creep) => c.memory.role === "claimer"});
    // TODO: Add code to build claimer.
  }

  public getBodyParts(creepRole: string, energyCapacity: number) {
    if (creepRole === C.BUILDER) {
      if (energyCapacity <= 300) { return [WORK, CARRY, MOVE]; }
      if (energyCapacity <= 400) { return [WORK, WORK, CARRY, MOVE]; }
      if (energyCapacity <= 500) { return [WORK, WORK, CARRY, MOVE, MOVE]; }
      if (energyCapacity <= 600) { return [WORK, WORK, WORK, CARRY, MOVE, MOVE]; }
      if (energyCapacity <= 700) { return [WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE]; }
      if (energyCapacity <= 800) { return [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE]; }
      if (energyCapacity <= 900) { return [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE]; }
      return [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
    }

    if (creepRole === C.HARVESTER) {
      if (energyCapacity <= 300) { return [WORK, CARRY, MOVE]; }
      if (energyCapacity <= 400) { return [WORK, WORK, CARRY, MOVE]; }
      if (energyCapacity <= 500) { return [WORK, WORK, CARRY, MOVE, MOVE]; }
      if (energyCapacity <= 600) { return [WORK, WORK, WORK, CARRY, MOVE, MOVE]; }
      if (energyCapacity <= 700) { return [WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE]; }
      if (energyCapacity <= 800) { return [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE]; }
      if (energyCapacity <= 900) { return [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE]; }
      return [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
    }

    if (creepRole === C.UPGRADER) {
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
    log.info("canCreateCreep: " + status);
    if (status === OK) {
      let uuid = Memory.uuid;
      Memory.uuid++;
      // let creepName: string = spawn.room.name + "_" + creepRole + uuid;
      let creepName: string = creepRole + uuid;
      log.info("creepName: " + creepName);
      let status2 = spawn.createCreep(bodyParts, creepName, {role: creepRole});
      log.info("status: " + status2);
      return _.isString(status2) ? OK : status2;
    }
  }

  public numberOfCreeps(creepRole: string, energyCapacity: number) {
    // TODO: Move this data into Memory.config.defaults.

    if (energyCapacity <= 300) {
      switch (creepRole) {
        case C.BUILDER: return 1;
        case C.HARVESTER: return 1;
        default: return 0;
      }
    }

    if (energyCapacity <= 400) {
      switch (creepRole) {
        // case C.BUILDER: return 2;
        case C.HARVESTER: return 3;
        // case C.UPGRADER: return 1;
        default: return 0;
      }
    }

    if (energyCapacity <= 500) {
      switch (creepRole) {
        case C.BUILDER: return 2;
        case C.HARVESTER: return 4;
        case C.UPGRADER: return 1;
        default: return 0;
      }
    }

    if (energyCapacity <= 600) {
      switch (creepRole) {
        case C.BUILDER: return 3;
        case C.HARVESTER: return 5;
        case C.UPGRADER: return 2;
        default: return 0;
      }
    }

    if (energyCapacity <= 700) {
      switch (creepRole) {
        case C.BUILDER: return 3;
        case C.HARVESTER: return 6;
        case C.UPGRADER: return 3;
        default: return 0;
      }
    }

    if (energyCapacity <= 800) {
      switch (creepRole) {
        case C.BUILDER: return 3;
        case C.HARVESTER: return 6;
        case C.UPGRADER: return 3;
        default: return 0;
      }
    }

    switch (creepRole) {
      case C.BUILDER: return 3;
      case C.HARVESTER: return 6;
      // case C.HAULER: return 3;
      case C.UPGRADER: return 3;
      default: return 0;
    }
  }
}
