import * as C from "../../../../config/constants";
// import * as Config from "../../../../config/config";
// import {log} from "../../../../lib/logger/log";
import {CreepSupport} from "./CreepSupport";
import {RoomHandler} from "../../../rooms/RoomHandler";

export class CreepBuilder extends CreepSupport {
  public static MinimumEnergyRequired = 200;

  public static getBodyParts(energyAvailable: number) {
    if (energyAvailable < CreepBuilder.MinimumEnergyRequired) {
      return undefined;
    }

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

  constructor (creep: Creep, roomHandler: RoomHandler) {
    super(creep, roomHandler);
  }

  public run() {
    super.run();

    let state = this.creep.memory.state || C.STATE_REFUELING;

    if (state === C.STATE_REFUELING) {
      this.getEnergy(this.creep);
    } else if (state === C.STATE_BUILDING) {
      let constructionSites = this.roomHandler.loadConstructionSites(this.creep.room);
      if (constructionSites.length > 0) {
        let constructionSite = this.creep.pos.findClosestByPath<ConstructionSite>(constructionSites);
        this.build(this.creep, constructionSite);
      } else {
        let damagedStructures = this.roomHandler.loadDamagedStructures(this.creep.room);
        if (damagedStructures.length > 0) {
          let damagedStructure = this.creep.pos.findClosestByPath<Structure>(damagedStructures);
          this.moveToRepair(this.creep, damagedStructure);
        }
      }
    }

    if (this.creep.carry[RESOURCE_ENERGY] || 0 > 0) {
      this.creep.memory.state = C.STATE_BUILDING;
    } else {
      this.creep.memory.state = C.STATE_REFUELING;
    }
  }

  public determineCurrentState(creep: Creep): string {
    let state = creep.memory.state;

    if (state === C.STATE_REFUELING) {
      if (!this.refuelingComplete(creep)) {
        return C.STATE_REFUELING;
      }
    }

    if (this.needsToRefuel(creep)) {
      return C.STATE_REFUELING;
    }

    if (this.roomHandler.constructionSitesExist(creep.room)) {
      return C.STATE_BUILDING;
    }

    // TODO: Add STATE_IDLE
    // return STATE_IDLE;
    return C.STATE_BUILDING;
  }

  public build(creep: Creep, constructionSite: ConstructionSite): void {
    if (creep.build(constructionSite) === ERR_NOT_IN_RANGE) {
      this.moveTo(creep, constructionSite.pos);
    }
  }

  public getEnergy(creep: Creep): void {
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

  // TODO: Change this to needsMoreCargo.
  public needsToRefuel(creep: Creep): boolean {
    return (_.sum(creep.carry) === 0);
  }

  public refuelingComplete(creep: Creep): boolean {
    return (_.sum(creep.carry) === creep.carryCapacity);
  }
}
