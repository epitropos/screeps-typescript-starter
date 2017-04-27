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
    let spawn = spawns[0]; // TODO: Pick a spawn using a better mechanism than this.

    if (spawn.spawning) {
      return;
    }

    let creeps = room.find<Creep>(FIND_MY_CREEPS);

    if (creeps.length === 0) {
      this.createCreepIfNecessary([], 1, C.HARVESTER, [WORK, CARRY, MOVE], spawn);
    }

    let availableEnergy = room.energyCapacityAvailable;

    // HARVESTERS
    let harvesters = _.filter(creeps, (creep) => creep.memory.role === C.HARVESTER);
    let maxHarvesters = this.numberOfCreeps(C.HARVESTER, availableEnergy);
    this.createCreepIfNecessary(harvesters,
      maxHarvesters,
      C.HARVESTER,
      this.getBodyParts(C.HARVESTER, availableEnergy),
      spawn);

    // MINERS
    let miners = _.filter(creeps, (creep) => creep.memory.role === C.MINER);
    let maxMiners = this.numberOfCreeps(C.MINER, availableEnergy);
    this.createCreepIfNecessary(miners,
      maxMiners,
      C.MINER,
      this.getBodyParts(C.BUILDER, availableEnergy),
      spawn);

    // HAULERS
    let haulers = _.filter(creeps, (creep) => creep.memory.role === C.HAULER);
    let maxHaulers = this.numberOfCreeps(C.HAULER, availableEnergy);
    this.createCreepIfNecessary(haulers,
      maxHaulers,
      C.HAULER,
      this.getBodyParts(C.BUILDER, availableEnergy),
      spawn);

    // BUILDERS
    let builders = _.filter(creeps, (creep) => creep.memory.role === C.BUILDER);
    let maxBuilders = this.numberOfCreeps(C.BUILDER, availableEnergy);
    this.createCreepIfNecessary(builders,
      maxBuilders,
      C.BUILDER,
      this.getBodyParts(C.BUILDER, availableEnergy),
      spawn);

    // UPGRADERS
    let upgraders = _.filter(creeps, (creep) => creep.memory.role === C.UPGRADER);
    let maxUpgraders = this.numberOfCreeps(C.UPGRADER, availableEnergy);
    this.createCreepIfNecessary(upgraders,
      maxUpgraders,
      C.UPGRADER,
      this.getBodyParts(C.UPGRADER, availableEnergy),
      spawn);

    // CLAIMERS
  }

  // TODO: Move this method into a static method in the appropriate creep class.
  public getBodyParts(creepRole: string, energyCapacity: number) {
    if (creepRole === C.BUILDER) {
      if (energyCapacity <=  300) { return [WORK,                                            CARRY,                      MOVE]; }// 111
      if (energyCapacity <=  400) { return [WORK, WORK,                                      CARRY,                      MOVE]; }// 211
      if (energyCapacity <=  500) { return [WORK, WORK,                                      CARRY,                      MOVE, MOVE]; }// 212
      if (energyCapacity <=  600) { return [WORK, WORK, WORK,                                CARRY,                      MOVE, MOVE]; }// 312
      if (energyCapacity <=  700) { return [WORK, WORK, WORK,                                CARRY,                      MOVE, MOVE, MOVE]; }// 313
      if (energyCapacity <=  800) { return [WORK, WORK, WORK,                                CARRY, CARRY,               MOVE, MOVE, MOVE]; }// 323
      if (energyCapacity <=  900) { return [WORK, WORK, WORK, WORK,                          CARRY, CARRY,               MOVE, MOVE, MOVE]; }// 423
      if (energyCapacity <= 1000) { return [WORK, WORK, WORK, WORK,                          CARRY, CARRY,               MOVE, MOVE, MOVE, MOVE]; }// 424
      if (energyCapacity <= 1100) { return [WORK, WORK, WORK, WORK, WORK,                    CARRY, CARRY,               MOVE, MOVE, MOVE, MOVE]; }// 524
      if (energyCapacity <= 1200) { return [WORK, WORK, WORK, WORK, WORK,                    CARRY, CARRY,               MOVE, MOVE, MOVE, MOVE, MOVE]; }// 525
      if (energyCapacity <= 1300) { return [WORK, WORK, WORK, WORK, WORK,                    CARRY, CARRY, CARRY,        MOVE, MOVE, MOVE, MOVE, MOVE]; }// 535
      if (energyCapacity <= 1400) { return [WORK, WORK, WORK, WORK, WORK, WORK,              CARRY, CARRY, CARRY,        MOVE, MOVE, MOVE, MOVE, MOVE]; }// 635
      if (energyCapacity <= 1500) { return [WORK, WORK, WORK, WORK, WORK, WORK,              CARRY, CARRY, CARRY,        MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]; }// 636
      if (energyCapacity <= 1600) { return [WORK, WORK, WORK, WORK, WORK, WORK, WORK,        CARRY, CARRY, CARRY,        MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]; }// 736
      if (energyCapacity <= 1700) { return [WORK, WORK, WORK, WORK, WORK, WORK, WORK,        CARRY, CARRY, CARRY,        MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]; }// 737
      if (energyCapacity <= 1800) { return [WORK, WORK, WORK, WORK, WORK, WORK, WORK,        CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]; }// 747
      if (energyCapacity <= 1900) { return [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,  CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]; }// 847
      if (energyCapacity <= 2000) { return [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,  CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]; }// 848
      return [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,  CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
    }

    if (creepRole === C.HARVESTER) {
      if (energyCapacity <=  300) { return [WORK,                                            CARRY,                      MOVE]; }// 111
      if (energyCapacity <=  400) { return [WORK, WORK,                                      CARRY,                      MOVE]; }// 211
      if (energyCapacity <=  500) { return [WORK, WORK,                                      CARRY,                      MOVE, MOVE]; }// 212
      if (energyCapacity <=  600) { return [WORK, WORK, WORK,                                CARRY,                      MOVE, MOVE]; }// 312
      if (energyCapacity <=  700) { return [WORK, WORK, WORK,                                CARRY,                      MOVE, MOVE, MOVE]; }// 313
      if (energyCapacity <=  800) { return [WORK, WORK, WORK,                                CARRY, CARRY,               MOVE, MOVE, MOVE]; }// 323
      if (energyCapacity <=  900) { return [WORK, WORK, WORK, WORK,                          CARRY, CARRY,               MOVE, MOVE, MOVE]; }// 423
      if (energyCapacity <= 1000) { return [WORK, WORK, WORK, WORK,                          CARRY, CARRY,               MOVE, MOVE, MOVE, MOVE]; }// 424
      if (energyCapacity <= 1100) { return [WORK, WORK, WORK, WORK, WORK,                    CARRY, CARRY,               MOVE, MOVE, MOVE, MOVE]; }// 524
      if (energyCapacity <= 1200) { return [WORK, WORK, WORK, WORK, WORK,                    CARRY, CARRY,               MOVE, MOVE, MOVE, MOVE, MOVE]; }// 525
      if (energyCapacity <= 1300) { return [WORK, WORK, WORK, WORK, WORK,                    CARRY, CARRY, CARRY,        MOVE, MOVE, MOVE, MOVE, MOVE]; }// 535
      if (energyCapacity <= 1400) { return [WORK, WORK, WORK, WORK, WORK, WORK,              CARRY, CARRY, CARRY,        MOVE, MOVE, MOVE, MOVE, MOVE]; }// 635
      if (energyCapacity <= 1500) { return [WORK, WORK, WORK, WORK, WORK, WORK,              CARRY, CARRY, CARRY,        MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]; }// 636
      if (energyCapacity <= 1600) { return [WORK, WORK, WORK, WORK, WORK, WORK, WORK,        CARRY, CARRY, CARRY,        MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]; }// 736
      if (energyCapacity <= 1700) { return [WORK, WORK, WORK, WORK, WORK, WORK, WORK,        CARRY, CARRY, CARRY,        MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]; }// 737
      if (energyCapacity <= 1800) { return [WORK, WORK, WORK, WORK, WORK, WORK, WORK,        CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]; }// 747
      if (energyCapacity <= 1900) { return [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,  CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]; }// 847
      if (energyCapacity <= 2000) { return [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,  CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]; }// 848
      return [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,  CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
    }

    if (creepRole === C.UPGRADER) {
      if (energyCapacity <=  300) { return [WORK,                                            CARRY,                      MOVE]; }// 111
      if (energyCapacity <=  400) { return [WORK, WORK,                                      CARRY,                      MOVE]; }// 211
      if (energyCapacity <=  500) { return [WORK, WORK,                                      CARRY,                      MOVE, MOVE]; }// 212
      if (energyCapacity <=  600) { return [WORK, WORK, WORK,                                CARRY,                      MOVE, MOVE]; }// 312
      if (energyCapacity <=  700) { return [WORK, WORK, WORK,                                CARRY,                      MOVE, MOVE, MOVE]; }// 313
      if (energyCapacity <=  800) { return [WORK, WORK, WORK,                                CARRY, CARRY,               MOVE, MOVE, MOVE]; }// 323
      if (energyCapacity <=  900) { return [WORK, WORK, WORK, WORK,                          CARRY, CARRY,               MOVE, MOVE, MOVE]; }// 423
      if (energyCapacity <= 1000) { return [WORK, WORK, WORK, WORK,                          CARRY, CARRY,               MOVE, MOVE, MOVE, MOVE]; }// 424
      if (energyCapacity <= 1100) { return [WORK, WORK, WORK, WORK, WORK,                    CARRY, CARRY,               MOVE, MOVE, MOVE, MOVE]; }// 524
      if (energyCapacity <= 1200) { return [WORK, WORK, WORK, WORK, WORK,                    CARRY, CARRY,               MOVE, MOVE, MOVE, MOVE, MOVE]; }// 525
      if (energyCapacity <= 1300) { return [WORK, WORK, WORK, WORK, WORK,                    CARRY, CARRY, CARRY,        MOVE, MOVE, MOVE, MOVE, MOVE]; }// 535
      if (energyCapacity <= 1400) { return [WORK, WORK, WORK, WORK, WORK, WORK,              CARRY, CARRY, CARRY,        MOVE, MOVE, MOVE, MOVE, MOVE]; }// 635
      if (energyCapacity <= 1500) { return [WORK, WORK, WORK, WORK, WORK, WORK,              CARRY, CARRY, CARRY,        MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]; }// 636
      if (energyCapacity <= 1600) { return [WORK, WORK, WORK, WORK, WORK, WORK, WORK,        CARRY, CARRY, CARRY,        MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]; }// 736
      if (energyCapacity <= 1700) { return [WORK, WORK, WORK, WORK, WORK, WORK, WORK,        CARRY, CARRY, CARRY,        MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]; }// 737
      if (energyCapacity <= 1800) { return [WORK, WORK, WORK, WORK, WORK, WORK, WORK,        CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]; }// 747
      if (energyCapacity <= 1900) { return [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,  CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]; }// 847
      if (energyCapacity <= 2000) { return [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,  CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]; }// 848
      return [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
    }

    return [WORK, CARRY, MOVE];
  }

  public createCreep(spawn: Spawn, creepRole: string, bodyParts: string[]) {
    let status = spawn.canCreateCreep(bodyParts, undefined);
    if (status === OK) {
      let uuid = Memory.uuid;
      Memory.uuid++;
      let creepName: string = creepRole + uuid;
      log.info("Creating creep: " + creepName);
      let status2 = spawn.createCreep(bodyParts, creepName, {role: creepRole});
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

  public createCreepIfNecessary(creeps: Creep[],
                                maxCreeps: number,
                                creepRole: string,
                                bodyParts: string[],
                                spawn: Spawn) {
    if (creeps.length >= maxCreeps) {
      return;
    }

    let result = spawn.canCreateCreep(bodyParts);
    if (result !== OK) {
      return;
    }

    this.createCreep(spawn, creepRole, bodyParts);
    return;
  }
}
