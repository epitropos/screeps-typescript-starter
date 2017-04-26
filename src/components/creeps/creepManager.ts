// TODO: Change game loop so creeps make requests (i.e. repair, energy, etc).

import * as Config from "../../config/config";
import * as C from "../../config/constants";

import * as miner from "./roles/miner";
// import * as builder from "./roles/builder";
import * as carrier from "./roles/carrier";
// import * as harvester from "./roles/harvester";
import * as upgrader from "./roles/upgrader";

import { log } from "../../lib/logger/log";

export let creeps: Creep[];
export let creepCount: number = 0;

export let builders: Creep[] = [];
export let miners: Creep[] = [];
export let carriers: Creep[] = [];
export let harvesters: Creep[] = [];
export let upgraders: Creep[] = [];

export let MAX_MINERS: number = 0;
export let MAX_CARRIERS: number = 0;
export let MAX_HARVESTERS: number = 6;
export let MAX_BUILDERS: number = 1;
export let MAX_UPGRADERS: number = 1;

// TODO: Use creepFactory to create creeps.
// TODO: Use creepManager to maintain correct population balance based on gameMapGoal and current room levels.

/**
 * Initialization scripts for CreepManager module.
 *
 * @export
 * @param {Room} room
 */
export function run(room: Room): void {
  let maxMinersFromMemory = room.memory.population.maximum.miners;
  if (maxMinersFromMemory) {
    MAX_MINERS = maxMinersFromMemory;
  } else {
    room.memory.population.maximum.miners = MAX_MINERS;
  }

  let maxCarriersFromMemory = room.memory.population.maximum.carriers;
  if (maxCarriersFromMemory) {
    MAX_CARRIERS = maxCarriersFromMemory;
  } else {
    room.memory.population.maximum.carriers = MAX_CARRIERS;
  }

  let maxHarvestersFromMemory = room.memory.population.maximum.harvesters;
  if (maxHarvestersFromMemory) {
    MAX_HARVESTERS = maxHarvestersFromMemory;
  } else {
    room.memory.population.maximum.harvesters = MAX_HARVESTERS;
  }

  let maxBuildersFromMemory = room.memory.population.maximum.builders;
  if (maxBuildersFromMemory) {
    MAX_BUILDERS = maxBuildersFromMemory;
  } else {
    room.memory.population.maximum.builders = MAX_BUILDERS;
  }

  let maxUpgradersFromMemory = room.memory.population.maximum.upgraders;
  if (maxUpgradersFromMemory) {
    MAX_UPGRADERS = maxUpgradersFromMemory;
  } else {
    room.memory.population.maximum.upgraders = MAX_UPGRADERS;
  }

  _loadCreeps(room);
  _buildMissingCreeps(room);

  _.each(creeps, (creep: Creep) => {
    // if (creep.memory.role === C.BUILDER) {
    //   builder.run(creep);
    // }
    // if (creep.memory.role === C.HARVESTER) {
    //   harvester.run(creep);
    // }
    if (creep.memory.role === C.MINER) {
      miner.run(creep);
    }
    // TODO: Change carrier to hauler
    if (creep.memory.role === C.CARRIER) {
      carrier.run(creep);
    }
    if (creep.memory.role === C.UPGRADER) {
      upgrader.run(creep);
    }
  });
}

/**
 * Loads and counts all available creeps.
 *
 * @param {Room} room
 */
function _loadCreeps(room: Room) {
  creeps = room.find<Creep>(FIND_MY_CREEPS);
  creepCount = _.size(creeps);

  // Iterate through each creep and push them into the role array.
  builders = _.filter(creeps, (creep) => creep.memory.role === C.BUILDER);
  miners = _.filter(creeps, (creep) => creep.memory.role === C.MINER);
  // TODO: Change carrier to hauler
  carriers = _.filter(creeps, (creep) => creep.memory.role === C.CARRIER);
  harvesters = _.filter(creeps, (creep) => creep.memory.role === C.HARVESTER);
  upgraders = _.filter(creeps, (creep) => creep.memory.role === C.UPGRADER);

  if (Config.ENABLE_DEBUG_MODE) {
    log.info(creepCount + " creeps found in the playground.");
  }
}

/**
 * Creates a new creep if we still have enough space.
 *
 * @param {Room} room
 */
function _buildMissingCreeps(room: Room) {
  let bodyParts: string[];

  let spawns: Spawn[] = room.find<Spawn>(FIND_MY_SPAWNS, {
    filter: (spawn: Spawn) => {
      return spawn.spawning === null;
    },
  });

  if (Config.ENABLE_DEBUG_MODE) {
    if (spawns[0]) {
      log.info("Spawn: " + spawns[0].name);
    }
  }

  // MOVE             50
  // CARRY            50
  // WORK             20
  // HEAL            200
  // TOUGH            20
  // ATTACK           80
  // RANGED_ATTACK   150

  if (miners.length < MAX_MINERS) {
    if (room.energyCapacityAvailable <= 300) { bodyParts = [WORK, WORK, MOVE];
    } else if (room.energyCapacityAvailable <= 400) { bodyParts = [WORK, WORK, WORK, MOVE];
    } else if (room.energyCapacityAvailable <= 500) { bodyParts = [WORK, WORK, WORK, WORK, MOVE];
    } else if (room.energyCapacityAvailable <= 600) { bodyParts = [WORK, WORK, WORK, WORK, WORK, MOVE]; }

    _.each(spawns, (spawn: Spawn) => {
      _spawnCreep(spawn, bodyParts, C.MINER);
    });
  }

  if (carriers.length < MAX_CARRIERS) {
    if (carriers.length < 1 || room.energyCapacityAvailable <= 800) {
      bodyParts = [CARRY, CARRY, CARRY, MOVE];
    } else if (room.energyCapacityAvailable > 800) {
      bodyParts = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE];
    }
    _.each(spawns, (spawn: Spawn) => {
      _spawnCreep(spawn, bodyParts, "carriers");
    });
  }

  // log.info("# harvesters: " + harvesters.length + " | MAX_HARVESTERS: " + MAX_HARVESTERS);
  // if (harvesters.length < MAX_HARVESTERS) {
  //   if (harvesters.length < 1 || room.energyCapacityAvailable <= 800) {
  //     bodyParts = [WORK, WORK, CARRY, MOVE];
  //   } else if (room.energyCapacityAvailable > 800) {
  //     bodyParts = [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
  //   }
  //   _.each(spawns, (spawn: Spawn) => {
  //     _spawnCreep(spawn, bodyParts, C.HARVESTER);
  //   });
  // }

  // if (builders.length < MAX_BUILDERS) {
  //   if (builders.length < 1 || room.energyCapacityAvailable <= 800) {
  //     bodyParts = [WORK, WORK, CARRY, MOVE];
  //   } else if (room.energyCapacityAvailable > 800) {
  //     bodyParts = [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
  //   }
  //   _.each(spawns, (spawn: Spawn) => {
  //     _spawnCreep(spawn, bodyParts, C.BUILDER);
  //   });
  // }

  // if (upgraders.length < MAX_UPGRADERS) {
  //   if (upgraders.length < 1 || room.energyCapacityAvailable <= 800) {
  //     bodyParts = [WORK, WORK, CARRY, MOVE];
  //   } else if (room.energyCapacityAvailable > 800) {
  //     bodyParts = [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
  //   }
  //   _.each(spawns, (spawn: Spawn) => {
  //     _spawnCreep(spawn, bodyParts, C.UPGRADER);
  //   });
  // }
}

/**
 * Spawns a new creep.
 *
 * @param {Spawn} spawn
 * @param {string[]} bodyParts
 * @param {string} role
 * @returns
 */
function _spawnCreep(spawn: Spawn, bodyParts: string[], role: string) {
  let uuid: number = Memory.uuid;
  let status: number | string = spawn.canCreateCreep(bodyParts, undefined);

  let properties: { [key: string]: any } = {
    role,
    room: spawn.room.name,
  };

  status = _.isString(status) ? OK : status;
  if (status === OK) {
    Memory.uuid = uuid + 1;
    let creepName: string = spawn.room.name + "_" + role + uuid;

    log.info("Started creating new creep: " + creepName);
    if (Config.ENABLE_DEBUG_MODE) {
      log.info("Body: " + bodyParts);
    }

    status = spawn.createCreep(bodyParts, creepName, properties);

    return _.isString(status) ? OK : status;
  } else {
    if (Config.ENABLE_DEBUG_MODE) {
      log.info("Failed creating new creep: " + status);
    }

    return status;
  }
}
