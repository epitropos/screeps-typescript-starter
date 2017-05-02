// import * as Config from "../../config/config";
import * as C from "../../config/constants";
import {log} from "../../lib/logger/log";
import {RoomHandler} from "../rooms/RoomHandler";
import {CreepBuilder} from "./roles/support/CreepBuilder";
import {CreepHauler} from "./roles/support/CreepHauler";
import {CreepMiner} from "./roles/support/CreepMiner";
import {CreepStocker} from "./roles/support/CreepStocker";
import {CreepUpgrader} from "./roles/support/CreepUpgrader";

export class CreepPopulationHandler {
  public roomHandler: RoomHandler;

  constructor(roomHandler: RoomHandler) {
    this.roomHandler = roomHandler;
  }

  public run() {
    // TODO: Change this to the miner requesting replacement.
    this.buildMissingMiners(this.roomHandler);
    this.buildMissingHaulers(this.roomHandler);

    this.buildMissingStockers(this.roomHandler);
    this.buildMissingBuilders(this.roomHandler);
    this.buildMissingUpgraders(this.roomHandler);


    // this.buildMissingRemoteMiners(this.roomHandler);
    // this.buildMissingRemoteHaulers(this.roomHandler);

    // this.buildMissingCreep(this.roomHandler);
  }

  public buildMissingStockers(roomHandler: RoomHandler) {
    let creeps = roomHandler.room.find(FIND_MY_CREEPS, {
      filter: (c: Creep) => c.memory.role === C.STOCKER,
    });
    log.info(creeps.length + " stockers found");
    if (creeps.length < 1) {
      let spawns = roomHandler.room.find<Spawn>(FIND_MY_SPAWNS);
      if (spawns.length > 0) {
        let spawn = spawns[0];
        let bodyParts = CreepStocker.getBodyParts(roomHandler.room.energyAvailable);
        let result = spawn.canCreateCreep(bodyParts);
        if (result === OK) {
          let creepName = spawn.createCreep(bodyParts, C.STOCKER + Memory.uuid++, {
            role: C.STOCKER,
          });
          log.info("Created creep: " + creepName);
        }
      }
    }
  }

  public buildMissingBuilders(roomHandler: RoomHandler) {
    let creeps = roomHandler.room.find(FIND_MY_CREEPS, {
      filter: (c: Creep) => c.memory.role === C.BUILDER,
    });
    log.info(creeps.length + " builders found");
    if (creeps.length < 1) {
      let spawns = roomHandler.room.find<Spawn>(FIND_MY_SPAWNS);
      if (spawns.length > 0) {
        let spawn = spawns[0];
        let bodyParts = CreepBuilder.getBodyParts(roomHandler.room.energyAvailable);
        log.info("bodyParts: " + bodyParts);
        let result = spawn.canCreateCreep(bodyParts);
        log.info("canCreateCreep builder: " + result);
        if (result === OK) {
          let creepName = spawn.createCreep(bodyParts, C.BUILDER + Memory.uuid++, {
            role: C.BUILDER,
          });
          log.info("Created creep: " + creepName);
        }
      }
    }
  }

  public buildMissingUpgraders(roomHandler: RoomHandler) {
    let creeps = roomHandler.room.find(FIND_MY_CREEPS, {
      filter: (c: Creep) => c.memory.role === C.UPGRADER,
    });
    log.info(creeps.length + " upgraders found");
    if (creeps.length < 1) {
      let spawns = roomHandler.room.find<Spawn>(FIND_MY_SPAWNS);
      if (spawns.length > 0) {
        let spawn = spawns[0];
        let bodyParts = CreepUpgrader.getBodyParts(roomHandler.room.energyAvailable);
        log.info("bodyParts: " + bodyParts);
        let result = spawn.canCreateCreep(bodyParts);
        log.info("canCreateCreep upgrader: " + result);
        if (result === OK) {
          let creepName = spawn.createCreep(bodyParts, C.UPGRADER + Memory.uuid++, {
            role: C.UPGRADER,
          });
          log.info("Created creep: " + creepName);
        }
      }
    }
  }

  public buildMissingHaulers(roomHandler: RoomHandler) {
    log.info("Get sources from memory.");
    let sourceIds = roomHandler.room.memory.sources;
    if (sourceIds === undefined) {
      return;
    }

    for (let sourceId in sourceIds) {
      let source = <Source> Game.getObjectById(sourceId);
      if (!source) {
        // TODO: Delete the memory entry.
        continue;
      }

      let haulerName = roomHandler.room.memory.sources[sourceId].haulerName;
      if (haulerName) {
        let hauler = Game.creeps[haulerName];
        if (hauler) {
          continue;
        } else if (!hauler) {
          roomHandler.room.memory.sources[sourceId].haulerName = undefined;
        }
      }

      let containerId = roomHandler.room.memory.sources[sourceId].containerId;
      let container = <Container> Game.getObjectById(containerId);
      if (!container) {
        // TODO: Delete the memory entry.
        continue;
      }

      // Create hauler.
      let bodyParts = CreepHauler.getBodyParts(roomHandler.room.energyCapacityAvailable);
      let spawns = roomHandler.room.find<Spawn>(FIND_MY_SPAWNS);
      if (spawns.length > 0) {
        let spawn = spawns[0];
        let result = spawn.canCreateCreep(bodyParts);
        if (result === OK) {
          log.info("Create hauler for container: " + containerId);
          let haulerName = spawn.createCreep(bodyParts, C.HAULER + Memory.uuid++, {
            containerId: containerId,
            role: C.HAULER,
          });
          roomHandler.room.memory.sources[source.id].haulerName = haulerName;
        }
        // let result = spawn.canCreateCreep([WORK, WORK, WORK, WORK, WORK, MOVE]);
        // if (result === OK) {
        //   let minerName = spawn.createCreep([WORK, WORK, WORK, WORK, WORK, MOVE], "M" + Memory.uuid++, {
        //     containerId: container.id,
        //     role: C.MINER,
        //     sourceId: source.id,
        //   });
        //   log.info("Miner spawning: " + minerName);
        //   // // let miner = Game.creeps[minerName];
        //   // // log.info("Miner spawning: " + miner.id);
        //   roomHandler.room.memory.sources[source.id].minerName = minerName;
        // } else {
        //   log.warning("creating miner: " + result);
        // }
      }
    }
  }

  public buildMissingMiners(roomHandler: RoomHandler) {
    // Verify sources are in memory.
    log.info("Get sources from memory.");
    let sources = roomHandler.room.memory.sources;
    if (sources === undefined) {
      roomHandler.room.memory.sources = {};

      log.info("Find sources.");
      let foundSources = roomHandler.room.find<Source>(FIND_SOURCES);
      for (let foundSource of foundSources) {
        log.info("Create memory for source: " + foundSource.id);
        roomHandler.room.memory.sources[foundSource.id] = {};
        log.info("Save id for source: " + foundSource.id);
        roomHandler.room.memory.sources[foundSource.id].id = foundSource.id;
      }
      sources = roomHandler.room.memory.sources;
    }

    log.info("sources: " + JSON.stringify(sources));
    for (let sourceId in sources) {
      log.info("source: " + sourceId);
      let source = <Source> Game.getObjectById(sourceId);

      // Verify containers are in memory.
      let containerId = roomHandler.room.memory.sources[source.id].containerId;
      log.info("ContainerId in memory: " + containerId);
      let container = null;
      if (containerId === undefined) {
        let possibleContainers = roomHandler.room.find<Container>(FIND_STRUCTURES, {
          filter: (c: Container) => c.structureType === STRUCTURE_CONTAINER
          && c.pos.isNearTo(source),
        });
        log.info("Possible Containers: " + possibleContainers.length);
        let index = 0;
        for (let possibleContainer of possibleContainers) {
          if (index++ === 0) {
            roomHandler.room.memory.sources[sourceId].containerId = possibleContainer.id;
            containerId = possibleContainer.id;
            container = possibleContainer;
            log.info("Container found at (" + container.pos.x + "," + container.pos.x + ")");
          } else {
            possibleContainer.destroy();
          }
        }
      } else {
        container = Game.getObjectById<Container>(containerId);
      }

      if (container !== null) {
        // Verify miners are in memory.
        let minerName = roomHandler.room.memory.sources[source.id].minerName;
        log.info("minerName in memory: " + minerName);
        if (minerName === undefined) {
          let spawns = roomHandler.room.find<Spawn>(FIND_MY_SPAWNS);
          if (spawns.length > 0) {
            let spawn = spawns[0];
            let bodyParts = CreepMiner.getBodyParts(roomHandler.room.energyCapacityAvailable);
            let result = spawn.canCreateCreep(bodyParts);
            if (result === OK) {
              let minerName = spawn.createCreep(bodyParts, "M" + Memory.uuid++, {
                containerId: container.id,
                role: C.MINER,
                sourceId: source.id,
              });
              log.info("Miner spawning: " + minerName);
              // // let miner = Game.creeps[minerName];
              // // log.info("Miner spawning: " + miner.id);
              roomHandler.room.memory.sources[source.id].minerName = minerName;
            } else {
              log.warning("creating miner: " + result);
            }
          }
        } else {
          // TODO: Remove this once creep replacement requests works.
          // Reset miner name.
          let miner = Game.creeps[minerName];
          if (!miner) {
            roomHandler.room.memory.sources[source.id].minerName = undefined;
          }
        }
      } else {
        log.warning("Source needs container at (" + source.pos.x + "," + source.pos.y + ")");
      }
    }
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

    // if (creeps.length === 0) {
    //   this.createCreepIfNecessary([], 1, C.HARVESTER, [WORK, CARRY, MOVE], spawn);
    // }

    let availableEnergy = room.energyCapacityAvailable;
    // let availableEnergy = room.energyAvailable;

    // // HARVESTERS
    // let harvesters = _.filter(creeps, (creep) => creep.memory.role === C.HARVESTER);
    // let maxHarvesters = this.numberOfCreeps(C.HARVESTER, availableEnergy);
    // if (harvesters.length < maxHarvesters) {
    //   this.createCreepIfNecessary(harvesters,
    //     maxHarvesters,
    //     C.HARVESTER,
    //     this.getBodyParts(C.HARVESTER, availableEnergy),
    //     spawn);
    //   return;
    // }

    // // MINERS
    // let miners = _.filter(creeps, (creep) => creep.memory.role === C.MINER);
    // let maxMiners = this.numberOfCreeps(C.MINER, availableEnergy);
    // if (miners.length < maxMiners) {
    //   if (miners.length === 0) {
    //     availableEnergy = roomHandler.room.energyAvailable;
    //   }
    //   this.createCreepIfNecessary(miners,
    //     maxMiners,
    //     C.MINER,
    //     this.getBodyParts(C.BUILDER, availableEnergy),
    //     spawn);
    //   return;
    // }

    // // HAULERS
    // let containers = roomHandler.room.find<Container>(FIND_STRUCTURES, {
    //   filter: (c: Container) => c.structureType === STRUCTURE_CONTAINER,
    // });
    // if (containers.length > 0) {
    //   let haulers = _.filter(creeps, (creep) => creep.memory.role === C.HAULER);
    //   let maxHaulers = this.numberOfCreeps(C.HAULER, availableEnergy);
    //   if (haulers.length < maxHaulers) {
    //     if (haulers.length === 0) {
    //       availableEnergy = roomHandler.room.energyAvailable;
    //     }
    //     this.createCreepIfNecessary(haulers,
    //       maxHaulers,
    //       C.HAULER,
    //       this.getBodyParts(C.HAULER, availableEnergy),
    //       spawn);
    //     return;
    //   }
    // }

    // STOCKERS
    let stockers = _.filter(creeps, (creep) => creep.memory.role === C.STOCKER);
    let maxStockers = this.numberOfCreeps(C.STOCKER, availableEnergy);
    if (stockers.length < maxStockers) {
      if (stockers.length === 0) {
        availableEnergy = roomHandler.room.energyAvailable;
      }
      this.createCreepIfNecessary(stockers,
        maxStockers,
        C.STOCKER,
        this.getBodyParts(C.BUILDER, availableEnergy),
        spawn);
      return;
    }

    // BUILDERS
    let builders = _.filter(creeps, (creep) => creep.memory.role === C.BUILDER);
    let maxBuilders = this.numberOfCreeps(C.BUILDER, availableEnergy);
    if (builders.length < maxBuilders) {
      if (builders.length === 0) {
        availableEnergy = roomHandler.room.energyAvailable;
      }
      this.createCreepIfNecessary(builders,
        maxBuilders,
        C.BUILDER,
        this.getBodyParts(C.BUILDER, availableEnergy),
        spawn);
      return;
    }

    // UPGRADERS
    let upgraders = _.filter(creeps, (creep) => creep.memory.role === C.UPGRADER);
    let maxUpgraders = this.numberOfCreeps(C.UPGRADER, availableEnergy);
    if (upgraders.length < maxUpgraders) {
      if (upgraders.length === 0) {
        availableEnergy = roomHandler.room.energyAvailable;
      }
      this.createCreepIfNecessary(upgraders,
        maxUpgraders,
        C.UPGRADER,
        this.getBodyParts(C.UPGRADER, availableEnergy),
        spawn);
      return;
    }

    // CLAIMERS
    // TODO: Code goes here.
  }

  // TODO: Move this method into a static method in the appropriate creep class.
  public getBodyParts(creepRole: string, energyCapacity: number) {
    switch (creepRole) {
      case C.BUILDER: return CreepBuilder.getBodyParts(energyCapacity);
      // case C.HAULER: return CreepHauler.getBodyParts(energyCapacity);
      // case C.MINER: return CreepMiner.getBodyParts(energyCapacity);
      case C.STOCKER: return CreepStocker.getBodyParts(energyCapacity);
      case C.UPGRADER: return CreepUpgrader.getBodyParts(energyCapacity);
      default: return [WORK, CARRY, MOVE];
    }
  }

  public createCreep(spawn: Spawn, creepRole: string, bodyParts: string[]) {
    let status = spawn.canCreateCreep(bodyParts, undefined);
    if (status === OK) {
      // let uuid = Memory.uuid;
      // Memory.uuid++;
      let creepName: string = creepRole + Memory.uuid++;
      log.info("Creating creep: " + creepName);
      let status2 = spawn.createCreep(bodyParts, creepName, {role: creepRole});
      return _.isString(status2) ? OK : status2;
    }
  }

  public numberOfCreeps(creepRole: string, energyCapacity: number) {
    // TODO: Move this data into Memory.config.defaults.

    if (energyCapacity <= 300) {
      switch (creepRole) {
        //case C.BUILDER: return 1;
        // case C.HARVESTER:
        // case C.HAULER:
        case C.STOCKER: return 1;
        default: return 0;
      }
    }

    if (energyCapacity <= 400) {
      switch (creepRole) {
        case C.BUILDER: return 1;
        // case C.HARVESTER:
        // case C.HAULER:
        case C.STOCKER: return 1;
        //case C.UPGRADER: return 1;
        default: return 0;
      }
    }

    if (energyCapacity <= 500) {
      switch (creepRole) {
        case C.BUILDER: return 1;
        // case C.HARVESTER:
        // case C.HAULER:
        case C.STOCKER: return 1;
        case C.UPGRADER: return 1;
        default: return 0;
      }
    }

    if (energyCapacity <= 600) {
      switch (creepRole) {
        case C.BUILDER: return 1;
        // case C.HARVESTER:
        // case C.HAULER:
        case C.STOCKER: return 2;
        case C.UPGRADER: return 1;
        default: return 0;
      }
    }

    if (energyCapacity <= 700) {
      switch (creepRole) {
        case C.BUILDER: return 2;
        // case C.HARVESTER:
        // case C.HAULER:
        case C.STOCKER: return 2;
        case C.UPGRADER: return 1;
        default: return 0;
      }
    }

    if (energyCapacity <= 800) {
      switch (creepRole) {
        case C.BUILDER: return 2;
        // case C.HARVESTER:
        // case C.HAULER:
        case C.STOCKER: return 2;
        case C.UPGRADER: return 2;
        default: return 0;
      }
    }

    switch (creepRole) {
      case C.BUILDER: return 2;
      // case C.HARVESTER:
      // case C.HAULER:
      case C.STOCKER: return 2;
      case C.UPGRADER: return 2;
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
    log.info("Result of building: " + creepRole + " = " + result);
    if (result !== OK) {
      if (result === ERR_NOT_ENOUGH_ENERGY && creeps.length === 0) {
        // Create an emergency creep.
        this.createCreep(spawn, creepRole, [WORK, CARRY, MOVE]);
      }
      return;
    }

    this.createCreep(spawn, creepRole, bodyParts);
    return;
  }
}
