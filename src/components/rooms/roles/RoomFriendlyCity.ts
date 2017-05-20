// import {log} from "../../../lib/logger/log";
import {CreepHandler} from "../../creeps/CreepHandler";
import {CreepPopulationHandler} from "../../creeps/CreepPopulationHandler";
import {RoomFriendly} from "./RoomFriendly";
import {RoomHandler} from "../RoomHandler";
import {StructureHandler} from "../../structures/StructureHandler";

export class RoomFriendlyCity extends RoomFriendly {
  public spawns: Spawn[];
  public creeps: Creep[];
  public enemyCreeps: Creep[];

  constructor(room: Room) {
    super(room);
    this.spawns = room.find<Spawn>(FIND_MY_SPAWNS);
    this.creeps = room.find<Creep>(FIND_MY_CREEPS);
    this.enemyCreeps = room.find<Creep>(FIND_HOSTILE_CREEPS);
  }

  public isPlainOrSwamp(roomPosition: RoomPosition) {
    let terrain = Game.map.getTerrainAt(roomPosition);
    if (terrain === "plain" || terrain === "swamp") {
      return true;
    }
    return false;
  }

  public findAdjacentPlainsAndSwamps(roomPosition: RoomPosition) {
    let adjacentPositions = new Array<RoomPosition>();

    let nwPosition = <RoomPosition> this.room.getPositionAt(roomPosition.x - 1, roomPosition.y - 1);
    if (this.isPlainOrSwamp(nwPosition)) { adjacentPositions.push(nwPosition); }

    let nPosition = <RoomPosition> this.room.getPositionAt(roomPosition.x , roomPosition.y - 1);
    if (this.isPlainOrSwamp(nPosition)) { adjacentPositions.push(nPosition); }

    let nePosition = <RoomPosition> this.room.getPositionAt(roomPosition.x + 1, roomPosition.y - 1);
    if (this.isPlainOrSwamp(nePosition)) { adjacentPositions.push(nePosition); }

    let wPosition = <RoomPosition> this.room.getPositionAt(roomPosition.x - 1, roomPosition.y);
    if (this.isPlainOrSwamp(wPosition)) { adjacentPositions.push(wPosition); }

    let ePosition = <RoomPosition> this.room.getPositionAt(roomPosition.x + 1, roomPosition.y);
    if (this.isPlainOrSwamp(ePosition)) { adjacentPositions.push(ePosition); }

    let swPosition = <RoomPosition> this.room.getPositionAt(roomPosition.x - 1, roomPosition.y + 1);
    if (this.isPlainOrSwamp(swPosition)) { adjacentPositions.push(swPosition); }

    let sPosition = <RoomPosition> this.room.getPositionAt(roomPosition.x , roomPosition.y + 1);
    if (this.isPlainOrSwamp(sPosition)) { adjacentPositions.push(sPosition); }

    let sePosition = <RoomPosition> this.room.getPositionAt(roomPosition.x + 1, roomPosition.y + 1);
    if (this.isPlainOrSwamp(sePosition)) { adjacentPositions.push(sePosition); }

    return adjacentPositions;
  }

  public determineContainer(source: Source) {
    let minerPosition = this.room.memory.sources[source.id].minerPosition;
    if (minerPosition === undefined) {
      return;
    }

    // Retrieve container. Delete from memory if it no longer exists.
    let containerId = this.room.memory.sources[source.id].containerId;
    if (containerId !== undefined) {
      let container = <Container> Game.getObjectById(containerId);
      if (!container) {
        delete this.room.memory.sources[source.id].containerId;
        containerId = undefined;
      }
    }

    // Look for containers next to source.
    let containers = this.room.find<Container>(FIND_STRUCTURES, {
      filter: (c: Container) => c.structureType === STRUCTURE_CONTAINER
      && c.pos.isNearTo(source),
    });
    if (containers.length > 0) {
      this.room.memory.sources[source.id].containerId
        = containerId
        = containers[0].id;
      delete this.room.memory.sources[source.id].containerConstructionSiteId;
    }

    // Retrieve container construction site. Delete from memory if it no longer exists.
    let containerConstructionSiteId = this.room.memory.sources[source.id].containerConstructionSiteId;
    if (containerConstructionSiteId !== undefined) {
      let containerConstructionSite = <ConstructionSite> Game.getObjectById(containerConstructionSiteId);

      if (!containerConstructionSite) {
        delete this.room.memory.sources[source.id].containerConstructionSiteId;
      }
    }

    // Look for construction sites next to source.
    let constructionSites = this.room.find<ConstructionSite>(FIND_CONSTRUCTION_SITES, {
      filter: (c: ConstructionSite) => c.structureType === STRUCTURE_CONTAINER
      && c.pos.isNearTo(source),
    });
    if (constructionSites.length > 0) {
      this.room.memory.sources[source.id].containerConstructionSiteId
        = containerConstructionSiteId
        = constructionSites[0].id;
    }

    // If neither container nor construction site exists then construct a container.
    if (containerId === undefined && containerConstructionSiteId === undefined) {
      this.room.createConstructionSite(minerPosition, STRUCTURE_CONTAINER);
      constructionSites = this.room.find<ConstructionSite>(FIND_CONSTRUCTION_SITES, {
      filter: (c: ConstructionSite) => c.structureType === STRUCTURE_CONTAINER
      && c.pos.isNearTo(source),
    });
      if (constructionSites.length > 0) {
        this.room.memory.sources[source.id].containerConstructionSiteId
          = containerConstructionSiteId
          = constructionSites[0].id;
      }
    }
  }

  public determineHaulerName(source: Source) {
    let haulerName = this.room.memory.sources[source.id].haulerName;

    // Retrieve hauler. Delete from memory if it no longer exists.
    if (haulerName) {
      let hauler = Game.creeps[haulerName];
      if (!hauler) {
        delete this.room.memory.sources[source.id].haulerName;
        haulerName = undefined;
      }
    }

    // // Send hauler creation request.
    // if (haulerName === undefined) {
    //   if (this.spawns.length === 0) {
    //     log.info("Cannot create hauler. No spawns in room: " + this.room.name + ".");
    //     return;
    //   }

    //   // TODO: Create request to create hauler.
    // }
  }

  public determineMinerName(source: Source) {
    // // TODO: Consider moving miner creation here. Will be easier later to move to requesting a new miner.
    // let minerName = this.room.memory.sources[source.id].minerName;
    // let miner = Game.creeps[minerName];
    // // Delete dead miner.
    // if (!miner) {
    //   this.room.memory.sources[source.id].minerName = minerName = undefined;
    // }
    let minerName = this.room.memory.sources[source.id].minerName;

    // Retrieve miner. Delete from memory if it no longer exists.
    if (minerName) {
      let miner = Game.creeps[minerName];
      if (!miner) {
        delete this.room.memory.sources[source.id].minerName;
        minerName = undefined;
      }
    }

    // // Send miner creation request.
    // if (minerName === undefined) {
    //   if (this.spawns.length === 0) {
    //     log.info("Cannot create miner. No spawns in room: " + this.room.name + ".");
    //     return;
    //   }

    //   // TODO: Create request to create miner.
    // }
  }

  public determineMinerPosition(source: Source) {
    let minerPosition = this.room.memory.sources[source.id].minerPosition;
    if (minerPosition === undefined) {
      let numberOfAdjacentPositions: number = 0;

      // Look at each adjacent position and gather plains and swamps
      let adjacentPositions = this.findAdjacentPlainsAndSwamps(source.pos);
      for (let adjacentPosition of adjacentPositions) {
        let adjacentPositions2 = this.findAdjacentPlainsAndSwamps(adjacentPosition);
        if (adjacentPositions2.length > numberOfAdjacentPositions) {
          minerPosition = adjacentPosition;
          numberOfAdjacentPositions = adjacentPositions2.length;
        }
      }

      this.room.memory.sources[source.id].minerPosition = minerPosition;
    }
  }

  public run() {
    super.run();

    // Process all sources.
    let sourceIds = this.room.memory.sources;
    if (sourceIds === undefined) {
      sourceIds = _.keys(this.room.find<Source>(FIND_SOURCES));
      for (let sourceId in sourceIds) {
        this.room.memory.sources[sourceId] = {};
      }
    }
    for (let sourceId in sourceIds) {
      let source = <Source> Game.getObjectById(sourceId);
      if (!source) {
        delete this.room.memory.sources[sourceId];
        continue;
      }

      if (this.room.memory.sources[sourceId] === undefined) {
        this.room.memory.sources[sourceId] = {};
      }

      this.determineMinerPosition(source);

      this.determineContainer(source);

      this.determineMinerName(source);

      this.determineHaulerName(source);
    }

    // Process all minerals.
    // TODO: Codes goes here.

    // TODO: Change instantiation to parameter.
    let creepPopulationHandler = new CreepPopulationHandler(new RoomHandler(this.room));
    creepPopulationHandler.run();

    // TODO: Move this code into RoomOwned.
    let structures = this.room.find(FIND_MY_STRUCTURES);
    _.forEach(structures, function(structure: Structure) {
      if (structure) {
        let structureHandler = new StructureHandler(structure);
        structureHandler.run();
      }
    });

    // TODO: Move this code into RoomOwned.
    let creeps = this.room.find(FIND_MY_CREEPS);
    _.forEach(creeps, function(creep: Creep) {
      if (creep) {
        let creepHandler = new CreepHandler(creep);
        creepHandler.run();
      }
    });
  }
}
