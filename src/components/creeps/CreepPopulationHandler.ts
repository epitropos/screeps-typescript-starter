// import * as Config from "../../config/config";
import * as C from "../../config/constants";
import {log} from "../../lib/logger/log";
import {RoomHandler} from "../rooms/RoomHandler";
import {CreepBuilder} from "./roles/support/CreepBuilder";
import {CreepExtractor} from "./roles/support/CreepExtractor";
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

    this.buildMissingExtractors(this.roomHandler);
    this.buildMissingMineralHaulers(this.roomHandler);

    this.buildMissingStockers(this.roomHandler);
    this.buildMissingBuilders(this.roomHandler);
    this.buildMissingUpgraders(this.roomHandler);
  }

  public buildMissingStockers(roomHandler: RoomHandler) {
    // TODO: Combine with spawn further in method.
    let spawn2 = roomHandler.room.find<Spawn>(FIND_MY_SPAWNS, {
      filter: (s: Spawn) => s.spawning !== null,
    });
    if (!spawn2) {
      return;
    }

    let creeps = roomHandler.room.find(FIND_MY_CREEPS, {
      filter: (c: Creep) => c.memory.role === C.STOCKER,
    });
    log.info(creeps.length + " stockers found");
    if (creeps.length < 2) {
      let spawns = roomHandler.room.find<Spawn>(FIND_MY_SPAWNS);
      if (spawns.length > 0) {
        let spawn = spawns[0];
        let bodyParts = CreepStocker.getBodyParts(roomHandler.room.energyAvailable);
        let creepName = spawn.createCreep(bodyParts, C.STOCKER + Memory.uuid++, {
          role: C.STOCKER,
        });
        log.info("Created creep: " + creepName);
      }
    }
  }

  public buildMissingBuilders(roomHandler: RoomHandler) {
    // TODO: Combine with spawn further in method.
    let spawn2 = roomHandler.room.find<Spawn>(FIND_MY_SPAWNS, {
      filter: (s: Spawn) => s.spawning !== null,
    });
    if (!spawn2) {
      return;
    }

    let creeps = roomHandler.room.find(FIND_MY_CREEPS, {
      filter: (c: Creep) => c.memory.role === C.BUILDER,
    });
    log.info(creeps.length + " builders found");
    if (creeps.length < 1) {
      let spawns = roomHandler.room.find<Spawn>(FIND_MY_SPAWNS);
      if (spawns.length > 0) {
        let spawn = spawns[0];
        let bodyParts = CreepBuilder.getBodyParts(roomHandler.room.energyAvailable);
        let creepName = spawn.createCreep(bodyParts, C.BUILDER + Memory.uuid++, {
          role: C.BUILDER,
        });
        log.info("Created creep: " + creepName);
      }
    }
  }

  public buildMissingUpgraders(roomHandler: RoomHandler) {
    // TODO: Combine with spawn further in method.
    let spawn2 = roomHandler.room.find<Spawn>(FIND_MY_SPAWNS, {
      filter: (s: Spawn) => s.spawning !== null,
    });
    if (!spawn2) {
      return;
    }

    let creeps = roomHandler.room.find(FIND_MY_CREEPS, {
      filter: (c: Creep) => c.memory.role === C.UPGRADER,
    });
    log.info(creeps.length + " upgraders found");
    if (creeps.length < 2) {
      let spawns = roomHandler.room.find<Spawn>(FIND_MY_SPAWNS);
      if (spawns.length > 0) {
        let spawn = spawns[0];
        let bodyParts = CreepUpgrader.getBodyParts(roomHandler.room.energyAvailable);
        let creepName = spawn.createCreep(bodyParts, C.UPGRADER + Memory.uuid++, {
          role: C.UPGRADER,
        });
        log.info("Created creep: " + creepName);
      }
    }
  }

  public buildMissingHaulers(roomHandler: RoomHandler) {
    // TODO: Combine with spawn further in method.
    let spawn2 = roomHandler.room.find<Spawn>(FIND_MY_SPAWNS, {
      filter: (s: Spawn) => s.spawning !== null,
    });
    if (!spawn2) {
      return;
    }

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
        let haulerName = C.HAULER + Memory.uuid++;
        let result = spawn.createCreep(bodyParts, haulerName, {
          containerId: containerId,
          role: C.HAULER,
        });
        if (result === haulerName) {
          roomHandler.room.memory.sources[source.id].haulerName = haulerName;
        } else {
          log.info(result + " happended trying to spawn " + haulerName);
        }
      }
    }
  }

  public buildMissingMineralHaulers(roomHandler: RoomHandler) {
    // TODO: Combine with spawn further in method.
    let spawn2 = roomHandler.room.find<Spawn>(FIND_MY_SPAWNS, {
      filter: (s: Spawn) => s.spawning !== null,
    });
    if (!spawn2) {
      return;
    }

    log.info("Get minerals from memory.");
    let mineralIds = roomHandler.room.memory.minerals;
    if (mineralIds === undefined) {
      return;
    }

    for (let mineralId in mineralIds) {
      let mineral = <Mineral> Game.getObjectById(mineralId);
      if (!mineral) {
        // TODO: Delete the memory entry.
        continue;
      }

      let haulerName = roomHandler.room.memory.minerals[mineralId].haulerName;
      if (haulerName) {
        let hauler = Game.creeps[haulerName];
        if (hauler) {
          continue;
        } else if (!hauler) {
          roomHandler.room.memory.minerals[mineralId].haulerName = undefined;
        }
      }

      let containerId = roomHandler.room.memory.minerals[mineralId].containerId;
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
        let haulerName = C.HAULER + Memory.uuid++;
        let result = spawn.createCreep(bodyParts, haulerName, {
          containerId: containerId,
          role: C.HAULER,
        });
        if (result === haulerName) {
          roomHandler.room.memory.minerals[mineral.id].haulerName = haulerName;
        } else {
          log.info(result + " happended trying to spawn " + haulerName);
        }
      }
    }
  }

  public buildMissingExtractors(roomHandler: RoomHandler) {
    // TODO: Combine with spawn further in method.
    let spawn2 = roomHandler.room.find<Spawn>(FIND_MY_SPAWNS, {
      filter: (s: Spawn) => s.spawning !== null,
    });
    if (!spawn2) {
      return;
    }

    // Verify minerals are in memory.
    log.info("Get minerals from memory.");
    let minerals = roomHandler.room.memory.minerals;
    if (minerals === undefined) {
      roomHandler.room.memory.minerals = {};

      log.info("Find minerals.");
      let foundMinerals = roomHandler.room.find<Mineral>(FIND_MINERALS);
      for (let foundMineral of foundMinerals) {
        log.info("Create memory for mineral: " + foundMineral.id);
        roomHandler.room.memory.minerals[foundMineral.id] = {};
        log.info("Save id for mineral: " + foundMineral.id);
        roomHandler.room.memory.minerals[foundMineral.id].id = foundMineral.id;
      }
      minerals = roomHandler.room.memory.minerals;
    }

    log.info("minerals: " + JSON.stringify(minerals));
    for (let mineralId in minerals) {
      log.info("mineral: " + mineralId);
      let mineral = <Mineral> Game.getObjectById(mineralId);

      // Verify containers are in memory.
      let containerId = roomHandler.room.memory.minerals[mineral.id].containerId;
      log.info("ContainerId in memory: " + containerId);
      let container = null;
      if (containerId === undefined) {
        let possibleContainers = roomHandler.room.find<Container>(FIND_STRUCTURES, {
          filter: (c: Container) => c.structureType === STRUCTURE_CONTAINER
          && c.pos.isNearTo(mineral),
        });
        log.info("Possible Containers: " + possibleContainers.length);
        let index = 0;
        for (let possibleContainer of possibleContainers) {
          if (index++ === 0) {
            roomHandler.room.memory.minerals[mineralId].containerId = possibleContainer.id;
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
        let extractorName = roomHandler.room.memory.minerals[mineral.id].extractorName;
        log.info("minerName in memory: " + extractorName);
        if (extractorName === undefined) {
          let spawns = roomHandler.room.find<Spawn>(FIND_MY_SPAWNS);
          if (spawns.length > 0) {
            let spawn = spawns[0];
            let bodyParts = CreepExtractor.getBodyParts(roomHandler.room.energyCapacityAvailable);
            let extractorName = C.EXTRACTOR + Memory.uuid++
            let result = spawn.createCreep(bodyParts, extractorName, {
              containerId: container.id,
              mineralId: mineral.id,
              role: C.EXTRACTOR,
            });
            log.info("Extractor spawning: " + extractorName);
            if (result === extractorName) {
              roomHandler.room.memory.minerals[mineral.id].extractorName = extractorName;
            } else {
              log.info(result + " happended trying to spawn " + extractorName);
            }
          }
        } else {
          // TODO: Remove this once creep replacement requests works.
          // Reset extractor name.
          let extractor = Game.creeps[extractorName];
          if (!extractor) {
            roomHandler.room.memory.minerals[mineral.id].extractorName = undefined;
          }
        }
      } else {
        log.warning("Mineral needs container at (" + mineral.pos.x + "," + mineral.pos.y + ")");
      }
    }
  }

  public buildMissingMiners(roomHandler: RoomHandler) {
    // TODO: Combine with spawn further in method.
    let spawn2 = roomHandler.room.find<Spawn>(FIND_MY_SPAWNS, {
      filter: (s: Spawn) => s.spawning !== null,
    });
    if (!spawn2) {
      return;
    }

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
            let minerName = C.MINER + Memory.uuid++;
            let result = spawn.createCreep(bodyParts, minerName, {
              containerId: container.id,
              role: C.MINER,
              sourceId: source.id,
            });
            log.info("Miner spawning: " + minerName);
            if (result === minerName) {
              roomHandler.room.memory.sources[source.id].minerName = minerName;
            } else {
              log.info(result + " happended trying to spawn " + minerName);
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

  public createCreep(spawn: Spawn, creepRole: string, bodyParts: string[]) {
    let status = spawn.canCreateCreep(bodyParts, undefined);
    if (status === OK) {
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
        case C.BUILDER: return 0;
        case C.STOCKER: return 1;
        default: return 0;
      }
    }

    if (energyCapacity <= 400) {
      switch (creepRole) {
        case C.BUILDER: return 1;
        case C.STOCKER: return 1;
        case C.UPGRADER: return 0;
        default: return 0;
      }
    }

    if (energyCapacity <= 500) {
      switch (creepRole) {
        case C.BUILDER: return 1;
        case C.STOCKER: return 1;
        case C.UPGRADER: return 1;
        default: return 0;
      }
    }

    if (energyCapacity <= 600) {
      switch (creepRole) {
        case C.BUILDER: return 1;
        case C.STOCKER: return 2;
        case C.UPGRADER: return 1;
        default: return 0;
      }
    }

    if (energyCapacity <= 700) {
      switch (creepRole) {
        case C.BUILDER: return 2;
        case C.STOCKER: return 2;
        case C.UPGRADER: return 1;
        default: return 0;
      }
    }

    if (energyCapacity <= 800) {
      switch (creepRole) {
        case C.BUILDER: return 2;
        case C.STOCKER: return 2;
        case C.UPGRADER: return 2;
        default: return 0;
      }
    }

    switch (creepRole) {
      case C.BUILDER: return 2;
      case C.STOCKER: return 2;
      case C.UPGRADER: return 2;
      default: return 0;
    }
  }
}
