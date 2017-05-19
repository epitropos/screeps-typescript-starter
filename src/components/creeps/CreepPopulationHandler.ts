import * as C from "../../config/constants";
// import * as Config from "../../config/config";
import {log} from "../../lib/logger/log";
import {RoomHandler} from "../rooms/RoomHandler";
import {CreepBuilder} from "./roles/support/CreepBuilder";
// import {CreepExtractor} from "./roles/support/CreepExtractor";
import {CreepHauler} from "./roles/support/CreepHauler";
import {CreepMiner} from "./roles/support/CreepMiner";
import {CreepStocker} from "./roles/support/CreepStocker";
import {CreepUpgrader} from "./roles/support/CreepUpgrader";

export class CreepPopulationHandler {
  // TODO: Figure a way to help ensure creeps grow in size.

  public roomHandler: RoomHandler;

  public MAX_STOCKERS = 0;
  public MAX_BUILDERS = 2;
  public MAX_UPGRADERS = 1;
  public MAX_HAULERS = 2;
  public MAX_MINERAL_HAULERS = 0;
  public MAX_EXTRACTORS = 0;
  public MAX_MINERS = 2;

  constructor(roomHandler: RoomHandler) {
    this.roomHandler = roomHandler;
  }

  public run() {
    let spawns = this.roomHandler.room.find<Spawn>(FIND_MY_SPAWNS, {
      filter: (s: Spawn) => s.spawning === null,
    });
    if (spawns.length === 0) {
      return;
    }

    let spawn = spawns[0];

    // TODO: Change this to the miner requesting replacement.
    this.buildMissingMiners(spawn, this.roomHandler);
    if (spawn.spawning) { return; }
    this.buildMissingHaulers(spawn, this.roomHandler);
    if (spawn.spawning) { return; }
    this.buildMissingExtractors(spawn, this.roomHandler);
    if (spawn.spawning) { return; }
    this.buildMissingMineralHaulers(spawn, this.roomHandler);
    if (spawn.spawning) { return; }
    this.buildMissingStockers(spawn, this.roomHandler);
    if (spawn.spawning) { return; }
    this.buildMissingBuilders(spawn, this.roomHandler);
    if (spawn.spawning) { return; }
    this.buildMissingUpgraders(spawn, this.roomHandler);
    if (spawn.spawning) { return; }
  }

  public buildMissingStockers(spawn: Spawn, roomHandler: RoomHandler) {
    let creeps = roomHandler.room.find(FIND_MY_CREEPS, {
      filter: (c: Creep) => c.memory.role === C.STOCKER,
    });
    if (creeps.length < this.MAX_STOCKERS) {
      let bodyParts = CreepStocker.getBodyParts(roomHandler.room.energyAvailable);
      if (bodyParts === undefined) {
        return OK;
      }
      let creepName = C.STOCKER + Memory.uuid++;
      let result = spawn.createCreep(bodyParts, creepName, {
        role: C.STOCKER,
      });
      if (result === creepName) {
        return OK;
      }
    }

    return OK;
  }

  public buildMissingBuilders(spawn: Spawn, roomHandler: RoomHandler) {
    let creeps = roomHandler.room.find(FIND_MY_CREEPS, {
      filter: (c: Creep) => c.memory.role === C.BUILDER,
    });
    if (creeps.length < this.MAX_BUILDERS) {
      let bodyParts = CreepBuilder.getBodyParts(roomHandler.room.energyAvailable / 2);
      if (bodyParts === undefined) {
        return OK;
      }
      let creepName = C.BUILDER + Memory.uuid++;
      let result = spawn.createCreep(bodyParts, creepName, {
        role: C.BUILDER,
      });
      if (result === creepName) {
        return OK;
      }
    }

    return OK;
  }

  public buildMissingUpgraders(spawn: Spawn, roomHandler: RoomHandler) {
    let creeps = roomHandler.room.find(FIND_MY_CREEPS, {
      filter: (c: Creep) => c.memory.role === C.UPGRADER,
    });
    if (creeps.length < this.MAX_UPGRADERS) {
      let bodyParts = CreepUpgrader.getBodyParts(roomHandler.room.energyAvailable / 2);
      if (bodyParts === undefined) {
        return OK;
      }
      let creepName = C.UPGRADER + Memory.uuid++;
      let result = spawn.createCreep(bodyParts, creepName, {
        role: C.UPGRADER,
      });
      if (result === creepName) {
        return OK;
      }
    }

    return OK;
  }

  public buildMissingHaulers(spawn: Spawn, roomHandler: RoomHandler) {
    if (roomHandler.room.memory.sources === undefined) {
      this.loadRoomSourcesIntoMemory(roomHandler);
    }

    let sourceIds = _.keys(roomHandler.room.memory.sources);
    for (let sourceId of sourceIds) {
      let source = <Source> Game.getObjectById(sourceId);
      let haulerName = roomHandler.room.memory.sources[sourceId].haulerName;
      if (haulerName !== undefined) {
        let hauler = Game.creeps[haulerName];
        if (hauler) {
          continue;
        }
        roomHandler.room.memory.sources[sourceId].haulerName = haulerName = undefined;
      }

      if (haulerName === undefined) {
        let haulerPosition = undefined;

        if (haulerPosition === undefined) {
          let container = this.loadSourceContainer(roomHandler, source);
          if (container) {
            haulerPosition = container.pos;
          }
        }

        if (haulerPosition === undefined) {
          let containerConstructionSite = this.loadSourceContainerConstructionSite(roomHandler, source);
          if (containerConstructionSite) {
            haulerPosition = containerConstructionSite.pos;
          }
        }

        if (haulerPosition === undefined) {
          // TODO: Use the miner's position for determination.
          let path = roomHandler.room.findPath(spawn.pos, source.pos);
          if (path.length > 2) {
            let step = path[path.length - 2];
            haulerPosition = new RoomPosition(
              step.x,
              step.y,
              roomHandler.room.name);
          }
        }

        // if (haulerPosition === undefined) {
        //   log.error("Unable to determine final destination for hauler for container: " + source.id);
        //   return;
        // }

        // Create hauler.
        haulerName = this.createSourceHauler(spawn, roomHandler, haulerPosition, source);
        if (haulerName !== undefined) {
          roomHandler.room.memory.sources[source.id].haulerName = haulerName;
        }
      }
    }

    return OK;
  }

  public buildMissingMineralHaulers(spawn: Spawn, roomHandler: RoomHandler) {
    if (spawn && roomHandler) {
      // TODO: Typescript standards are stupid.
    }
    // let mineralIds = roomHandler.room.memory.minerals;
    // if (mineralIds === undefined) {
    //   return 0;
    // }

    // for (let mineralId in mineralIds) {
    //   let mineral = <Mineral> Game.getObjectById(mineralId);
    //   if (!mineral || mineral.mineralAmount === 0) {
    //     // TODO: Delete the memory entry.
    //     continue;
    //   }

    //   let haulerName = roomHandler.room.memory.minerals[mineralId].haulerName;
    //   if (haulerName) {
    //     let hauler = Game.creeps[haulerName];
    //     if (hauler) {
    //       continue;
    //     } else if (!hauler) {
    //       roomHandler.room.memory.minerals[mineralId].haulerName = undefined;
    //     }
    //   }

    //   let containerId = roomHandler.room.memory.minerals[mineralId].containerId;
    //   let container = <Container> Game.getObjectById(containerId);
    //   if (!container) {
    //     // TODO: Delete the memory entry.
    //     continue;
    //   }

    //   // Create hauler.
    //   let bodyParts = CreepHauler.getBodyParts(roomHandler.room.energyAvailable);
    //   let newHaulerName = C.HAULER + Memory.uuid++;
    //   let result = spawn.createCreep(bodyParts, newHaulerName, {
    //     containerId: containerId,
    //     role: C.HAULER,
    //   });
    //   if (result === haulerName) {
    //     roomHandler.room.memory.minerals[mineral.id].haulerName = newHaulerName;
    //     return OK;
    //   }
    // }

    return OK;
  }

  public buildMissingExtractors(spawn: Spawn, roomHandler: RoomHandler) {
    if (spawn && roomHandler) {
      // TODO: Typescript standards are stupid.
    }
    // // Verify minerals are in memory.
    // let minerals = roomHandler.room.memory.minerals;
    // if (minerals === undefined) {
    //   roomHandler.room.memory.minerals = {};

    //   let foundMinerals = roomHandler.room.find<Mineral>(FIND_MINERALS);
    //   for (let foundMineral of foundMinerals) {
    //     roomHandler.room.memory.minerals[foundMineral.id] = {};
    //     roomHandler.room.memory.minerals[foundMineral.id].id = foundMineral.id;
    //   }
    //   minerals = roomHandler.room.memory.minerals;
    // }

    // for (let mineralId in minerals) {
    //   let mineral = <Mineral> Game.getObjectById(mineralId);
    //   if (!mineral || mineral.mineralAmount === 0) {
    //     // TODO: Delete the memory entry.
    //     continue;
    //   }

    //   // Verify containers are in memory.
    //   let containerId = roomHandler.room.memory.minerals[mineral.id].containerId;
    //   let container = null;
    //   if (containerId === undefined) {
    //     let possibleContainers = roomHandler.room.find<Container>(FIND_STRUCTURES, {
    //       filter: (c: Container) => c.structureType === STRUCTURE_CONTAINER
    //       && c.pos.isNearTo(mineral),
    //     });
    //     let index = 0;
    //     for (let possibleContainer of possibleContainers) {
    //       if (index++ === 0) {
    //         roomHandler.room.memory.minerals[mineralId].containerId = possibleContainer.id;
    //         containerId = possibleContainer.id;
    //         container = possibleContainer;
    //       } else {
    //         possibleContainer.destroy();
    //       }
    //     }
    //   } else {
    //     container = Game.getObjectById<Container>(containerId);
    //   }

    //   if (container !== null) {
    //     // Verify miners are in memory.
    //     let extractorName = roomHandler.room.memory.minerals[mineral.id].extractorName;
    //     if (extractorName === undefined) {
    //       let bodyParts = CreepExtractor.getBodyParts(roomHandler.room.energyAvailable);
    //       let extractorName = C.EXTRACTOR + Memory.uuid++;
    //       let result = spawn.createCreep(bodyParts, extractorName, {
    //         containerId: container.id,
    //         mineralId: mineral.id,
    //         role: C.EXTRACTOR,
    //       });
    //       if (result === extractorName) {
    //         roomHandler.room.memory.minerals[mineral.id].extractorName = extractorName;
    //         return OK;
    //       }
    //     } else {
    //       // TODO: Remove this once creep replacement requests works.
    //       // Reset extractor name.
    //       let extractor = Game.creeps[extractorName];
    //       if (!extractor) {
    //         roomHandler.room.memory.minerals[mineral.id].extractorName = undefined;
    //       }
    //     }
    //   }
    // }

    return OK;
  }

  public buildMissingMiners(spawn: Spawn, roomHandler: RoomHandler) {
    if (roomHandler.room.memory.sources === undefined) {
      this.loadRoomSourcesIntoMemory(roomHandler);
    }

    let sourceIds = _.keys(roomHandler.room.memory.sources);
    for (let sourceId of sourceIds) {
      let source = <Source> Game.getObjectById(sourceId);
      let minerName = roomHandler.room.memory.sources[sourceId].minerName;
      if (minerName !== undefined) {
        let miner = Game.creeps[minerName];
        if (miner) {
          continue;
        }
        roomHandler.room.memory.sources[sourceId].minerName = minerName = undefined;
      }

      if (minerName === undefined) {
        let minerPosition = undefined;

        if (minerPosition === undefined) {
          let container = this.loadSourceContainer(roomHandler, source);
          if (container) {
            minerPosition = container.pos;
          }
        }

        if (minerPosition === undefined) {
          let containerConstructionSite = this.loadSourceContainerConstructionSite(roomHandler, source);
          if (containerConstructionSite) {
            minerPosition = containerConstructionSite.pos;
          }
        }

        if (minerPosition === undefined) {
          let path = roomHandler.room.findPath(spawn.pos, source.pos);
          if (path.length > 2) {
            let step = path[path.length - 2];
            minerPosition = new RoomPosition(
              step.x,
              step.y,
              roomHandler.room.name);
          }
        }

        // if (minerPosition === undefined) {
        //   log.error("Unable to determine final destination for miner for container: " + source.id);
        //   return;
        // }

        // Create miner.
        minerName = this.createSourceMiner(spawn, roomHandler, source, minerPosition);
        if (minerName !== undefined) {
          roomHandler.room.memory.sources[source.id].minerName = minerName;
        }
      }
    }

    return OK;
    // let sourceIds = _.keys(roomHandler.room.memory.sources);
    // for (let sourceId of sourceIds) {
    //   if (sourceId === undefined) {
    //     continue;
    //   }

    //   let source = <Source> Game.getObjectById(sourceId);
    //   if (!source) {
    //     continue;
    //   }
    //   let minerPosition = roomHandler.room.memory.soruces[sourceId].minerPosition;
    //   if (minerPosition === undefined) {
    //     continue;
    //   }

    //   let minerName = roomHandler.room.memory.sources[sourceId].minerName;
    //   if (minerName !== undefined) {
    //     let miner = Game.creeps[minerName];
    //     if (!miner) {
    //       delete  roomHandler.room.memory.sources[sourceId].minerName;
    //     }
    //   }
    // }
  }

  private loadRoomSourcesIntoMemory(roomHandler: RoomHandler) {
    // TODO: This will get called every tick for rooms without sources. Either verify all rooms have
    // at least one source, or store the number of sources in memory.
    let sources = roomHandler.room.find<Source>(FIND_SOURCES);
    if (sources && sources.length > 0) {
      for (let sourceId in sources) {
        roomHandler.room.memory.sources[sourceId] = {};      }
    }
  }

  private loadSourceContainer(roomHandler: RoomHandler, source: Source) {
    let containers = roomHandler.room.find<Container>(FIND_STRUCTURES, {
      filter: (c: Container) => c.structureType === STRUCTURE_CONTAINER
      && c.pos.isNearTo(source),
    });
    if (containers.length > 0) {
      roomHandler.room.memory.sources[source.id].containerId = containers[0].id;
      return containers[0];
    }
    // TODO: Delete all but one container instead of ignoring them.

    return undefined;
  }

  private loadSourceContainerConstructionSite(roomHandler: RoomHandler, source: Source) {
    let constructionSites = roomHandler.room.find<ConstructionSite>(FIND_CONSTRUCTION_SITES, {
      filter: (c: ConstructionSite) => c.structureType === STRUCTURE_CONTAINER
      && c.pos.isNearTo(source),
    });
    if (constructionSites.length > 0) {
      return constructionSites[0];
    }
    // TODO: Delete all but one container construction site instead of ignoring them.
    // TODO: If there is a container then delete all container construction sites.

    return undefined;
  }

  // TODO: Add container to signature.
  private createSourceHauler(spawn: Spawn,
                             roomHandler: RoomHandler,
                             myRefuelPosition: RoomPosition | undefined,
                             source: Source) {
    let bodyParts = CreepHauler.getBodyParts(roomHandler.room.energyAvailable);
    if (bodyParts === undefined) {
      return undefined;
    }
    let haulerName = C.HAULER + Memory.uuid++;
    let result = spawn.createCreep(
      bodyParts,
      haulerName,
      {
        refuelPosition: myRefuelPosition,
        role: C.HAULER,
        sourceId: source.id,
      });

    if (result === haulerName) {
      return haulerName;
    } else {
      log.error("result of creating hauler: " + haulerName + " = " + result);
      return undefined;
    }
  }

  private createSourceMiner(spawn: Spawn,
                            roomHandler: RoomHandler,
                            source: Source,
                            destination: RoomPosition | undefined) {
    let bodyParts = CreepMiner.getBodyParts(roomHandler.room.energyAvailable);
    if (bodyParts === undefined) {
      return undefined;
    }
    let minerName = C.MINER + Memory.uuid++;
    let result = spawn.createCreep(
      bodyParts,
      minerName,
      {
        finalDestination: destination,
        role: C.MINER,
        sourceId: source.id,
      });

    if (result === minerName) {
      return minerName;
    } else {
      log.error("result of creating miner: " + minerName + " = " + result);
      return undefined;
    }
  }
}
