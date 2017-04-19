import * as Config from "../../config/config";

import * as miner from "./roles/miner";
import * as carrier from "./roles/carrier";
import * as harvester from "./roles/harvester";
import * as upgrader from "./roles/upgrader";

import { log } from "../../lib/logger/log";

export let creeps: Creep[];
export let creepCount: number = 0;

export let miners: Creep[] = [];
export let carriers: Creep[] = [];
export let harvesters: Creep[] = [];
export let upgraders: Creep[] = [];

/**
 * Initialization scripts for CreepManager module.
 *
 * @export
 * @param {Room} room
 */
export function run(room: Room): void {
  _loadCreeps(room);
  _buildMissingCreeps(room);

  _.each(creeps, (creep: Creep) => {
    if (creep.memory.role === "harvester") {
      harvester.run(creep);
    }
    if (creep.memory.role === "miner") {
      miner.run(creep);
    }
    if (creep.memory.role === "carrier") {
      carrier.run(creep);
    }
    if (creep.memory.role === "upgrader") {
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
  miners = _.filter(creeps, (creep) => creep.memory.role === "miner");
  carriers = _.filter(creeps, (creep) => creep.memory.role === "carrier");
  harvesters = _.filter(creeps, (creep) => creep.memory.role === "harvester");
  upgraders = _.filter(creeps, (creep) => creep.memory.role === "upgrader");

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

  /*
  if (miners.length < 6) {
    bodyParts = [WORK, WORK, CARRY, MOVE];
    _.each(spawns, (spawn: Spawn) => {
      _spawnCreep(spawn, bodyParts, "miner");
    });
  }

  if (carriers.length < 6) {
    bodyParts = [CARRY, CARRY, CARRY, MOVE];
    _.each(spawns, (spawn: Spawn) => {
      _spawnCreep(spawn, bodyParts, "carriers");
    });
  }
  */

  if (harvesters.length < 6) {
    if (harvesters.length < 1 || room.energyCapacityAvailable <= 800) {
      bodyParts = [WORK, WORK, CARRY, MOVE];
    } else if (room.energyCapacityAvailable > 800) {
      bodyParts = [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
    }

    _.each(spawns, (spawn: Spawn) => {
      _spawnCreep(spawn, bodyParts, "harvester");
    });
  }

  if (upgraders.length < 1) {
    bodyParts = [WORK, WORK, CARRY, MOVE];
    _.each(spawns, (spawn: Spawn) => {
      _spawnCreep(spawn, bodyParts, "upgrader");
    });
  }
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
    let creepName: string = spawn.room.name + " - " + role + uuid;

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
