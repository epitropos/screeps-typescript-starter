import * as C from "../../../../config/constants";
// import * as Config from "../../../../config/config";
// import {log} from "../../../../lib/logger/log";
import {CreepSupport} from "./CreepSupport";
import {RoomHandler} from "../../../rooms/RoomHandler";

export class CreepBuilder extends CreepSupport {
  public static getBodyParts(energyAvailable: number) {
    let bodyParts: string[] = [];
    let bodySegmentSize = 200;

    let bodyPartsSize = 0;

    while (bodyPartsSize + bodySegmentSize < energyAvailable) {
      bodyParts.push(WORK);
      bodyParts.push(CARRY);
      bodyParts.push(MOVE);
      bodyPartsSize += bodySegmentSize;
    }

    // TODO: Move function into CreepSupport.
    return _.sortBy(bodyParts, function(bodyPart) {
      switch (bodyPart) {
        case CARRY: return 2;
        case MOVE: return 3;
        case WORK: return 1;
        default: return 99;
      }
    });
  }

  // TODO: Change into a shared enum.
  public readonly STATE_BUILDING = "BUILDING";
  public readonly STATE_REFUELING = "REFUELING";

  constructor (creep: Creep, roomHandler: RoomHandler) {
    super(creep, roomHandler);
  }

  public run() {
    super.run();

    let state = this.creep.memory.state = this.determineCurrentState(this.creep);

    if (state === this.STATE_REFUELING) {
      this.getEnergy(this.creep);
      return;
    }

    if (state === this.STATE_BUILDING) {
      let constructionSites = this.roomHandler.loadConstructionSites(this.creep.room);
      if (constructionSites.length > 0) {
        let constructionSite = this.creep.pos.findClosestByPath<ConstructionSite>(constructionSites);
        this.build(this.creep, constructionSite);
        return;
      }

      let damagedStructures = this.roomHandler.loadDamagedStructures(this.creep.room);
      if (damagedStructures.length > 0) {
        let damagedStructure = this.creep.pos.findClosestByPath<Structure>(damagedStructures);
        this.moveToRepair(this.creep, damagedStructure);
        return;
      }
    }

    // TODO: Move randomly. This should keep the creep as an obstacle to a minimum.
    // TODO: Otherwise, move creep to an idle location.
  }

  public determineCurrentState(creep: Creep): string {
    let state = creep.memory.state;

    if (state === this.STATE_REFUELING) {
      if (!this.refuelingComplete(creep)) {
        return this.STATE_REFUELING;
      }
    }

    if (this.needsToRefuel(creep)) {
      return this.STATE_REFUELING;
    }

    if (this.roomHandler.constructionSitesExist(creep.room)) {
      return this.STATE_BUILDING;
    }

    // TODO: Add STATE_IDLE
    // return STATE_IDLE;
    return this.STATE_BUILDING;
  }

  public build(creep: Creep, constructionSite: ConstructionSite): void {
    if (creep.build(constructionSite) === ERR_NOT_IN_RANGE) {
      this.moveTo(creep, constructionSite.pos);
    }
  }

  public getEnergy(creep: Creep): void {
    // // let containers = this.roomHandler.loadContainersWithEnergy(creep.room);
    // // if (containers.length > 0) {
    // //   let container = creep.pos.findClosestByPath<Container>(containers);
    // //   this.moveToWithdraw(creep, container);
    // //   return;
    // // }

    // // let energySource = creep.pos.findClosestByPath<Source>(FIND_SOURCES_ACTIVE);
    // // this.moveToHarvest(creep, energySource);

    // let stepsToContainer = Infinity;
    // let closestContainer = creep.pos.findClosestByPath<Container>(FIND_MY_STRUCTURES, {
    //   filter: (s: Structure) => s.structureType === STRUCTURE_CONTAINER,
    // });
    // if (closestContainer) {
    //   let pathToContainer = creep.room.findPath(creep.pos, closestContainer.pos);
    //   stepsToContainer = pathToContainer.length;
    // }

    // let storage = creep.room.storage;
    // let stepsToStorage = Infinity;
    // if (storage) {
    //   let pathToStorage = creep.room.findPath(creep.pos, storage.pos);
    //   stepsToStorage = pathToStorage.length;
    // }

    // if (stepsToContainer === Infinity && stepsToStorage === Infinity) {
    //   return;
    // } else if (stepsToContainer < stepsToStorage) {
    //   this.moveToWithdraw(creep, closestContainer);
    // } else {
    //   this.moveToWithdrawFromStorage(creep, storage);
    // }
    // Get path to closest container.
    let pathToContainer = undefined;
    // let container = undefined;
    // let containers = creep.room.find<Container>(FIND_STRUCTURES, {
    //   filter: (c: Container) => (c.structureType === STRUCTURE_CONTAINER && c.store[RESOURCE_ENERGY] > 0),
    // });
    // // TODO: Check if doing findClosestByPath with zero length array results in undefined, null or an error.
    // if (containers.length > 0) {
    //   container = creep.pos.findClosestByPath<Container>(containers);
    //   if (container) {
    //     pathToContainer = creep.pos.findPathTo(container);
    //   }
    // }

    // Get path to storage.
    let pathToStorage = undefined;
    let storage = creep.room.storage;
    if (storage) {
      pathToStorage = creep.pos.findPathTo(storage);
    }

    if (pathToContainer === undefined && pathToStorage === undefined) {
      return;
    }

    if (pathToContainer === undefined) {
      this.moveToWithdrawFromStorage(creep, <Storage> storage);
      return;
    }

    // if (pathToStorage === undefined) {
    //   this.moveToWithdraw(creep, <Container> container);
    //   return;
    // }

    // if (pathToContainer.length <= pathToStorage.length) {
    //   this.moveToWithdraw(creep, <Container> container);
    //   return;
    // }

    this.moveToWithdrawFromStorage(creep, <Storage> storage);
    return;
  }

  public moveToRepair(creep: Creep, structure: Structure): void {
    if (this.tryRepair(creep, structure) === ERR_NOT_IN_RANGE) {
      creep.moveTo(structure, {visualizePathStyle: {stroke: C.WHITE}});
    }
  }

  public tryRepair(creep: Creep, structure: Structure): number {
    return creep.repair(structure);
  }

  /*
  protected moveToUnderConstructionRoom(creep: Creep, roomManager: RoomManager): ??? {

  }
  */
}
