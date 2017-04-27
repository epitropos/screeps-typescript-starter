// import * as Config from "../../config/config";
// import {log} from "../../lib/logger/log";

// import {RoomAllyCity} from "./roles/RoomAllyCity";
// import {RoomAllyColony} from "./roles/RoomAllyColony";
import {RoomEnemyCity} from "./roles/RoomEnemyCity";
import {RoomEnemyColony} from "./roles/RoomEnemyColony";
import {RoomFriendlyCity} from "./roles/RoomFriendlyCity";
import {RoomFriendlyColony} from "./roles/RoomFriendlyColony";
import {RoomNeutral} from "./roles/RoomNeutral";

export class RoomHandler {
  public room: Room;

  constructor (room: Room) {
    this.room = room;
  }

  public run() {
    // log.info("Processing room: " + this.room.name);

    let spawns = this.room.find(FIND_MY_SPAWNS);
    if (spawns.length > 0) {
      let roomCity = new RoomFriendlyCity(this.room);
      roomCity.run();
      return;
    }

    let controller = this.room.controller;
    if (controller && controller.my) {
      let roomColony = new RoomFriendlyColony(this.room);
      roomColony.run();
      return;
    }

    spawns = this.room.find(FIND_HOSTILE_SPAWNS);
    if (spawns.length > 0) {
      let roomEnemyCity = new RoomEnemyCity(this.room);
      roomEnemyCity.run();
      return;
    }

    if (controller && controller.owner.username !== "") {
      let roomEnemyColony = new RoomEnemyColony(this.room);
      roomEnemyColony.run();
      return;
    }

    let roomNeutral = new RoomNeutral(this.room);
    roomNeutral.run();
  }

  public controllerNeedsUpgrading(room: Room): boolean {
    if (room.controller) {
      return room.controller.level < 8;
    }

    return false;
  }

  public constructionSitesExist(room: Room): boolean {
    let constructionSites = room.find(FIND_MY_CONSTRUCTION_SITES);
    return constructionSites.length > 0;
  }

  public loadExtensions(room: Room): Extension[] {
    return room.find<Extension>(FIND_STRUCTURES, {
      filter: (s: Extension) => s.structureType === STRUCTURE_EXTENSION && s.energy < s.energyCapacity,
    });
  }

  public loadContainers(room: Room): Container[] {
    return room.find<Container>(FIND_STRUCTURES, {
      filter: (s: Container) => s.structureType === STRUCTURE_CONTAINER,
    });
  }

  public loadContainersWithEnergy(room: Room): Container[] {
    return room.find<Container>(FIND_STRUCTURES, {
      filter: (c: Container) => c.structureType === STRUCTURE_CONTAINER && c.store[RESOURCE_ENERGY] > 0,
    });
  }

  public loadContainersWithSpace(room: Room): Container[] {
    return room.find<Container>(FIND_STRUCTURES, {
      filter: (s: Container) => s.structureType === STRUCTURE_CONTAINER && _.sum(s.store) < s.storeCapacity,
    });
  }

  public loadTowers(room: Room): Tower[] {
    return room.find<Tower>(FIND_STRUCTURES, {
      filter: (s: Tower) => s.structureType === STRUCTURE_TOWER && s.energy < s.energyCapacity,
    });
  }

  public loadConstructionSites(room: Room): ConstructionSite[] {
    return room.find<ConstructionSite>(FIND_CONSTRUCTION_SITES);
  }

  public loadDamagedStructures(room: Room): Structure[] {
    return room.find<Structure>(FIND_STRUCTURES,
    {filter: (s: Structure) => (s.structureType !== STRUCTURE_WALL && s.hits < s.hitsMax)
      || (s.structureType === STRUCTURE_WALL && s.hits < 40000)});
  }
}
