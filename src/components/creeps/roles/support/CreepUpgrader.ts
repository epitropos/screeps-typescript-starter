// import * as Config from "../../../../config/config";
// import {log} from "../../../../lib/logger/log";
import {CreepSupport} from "./CreepSupport";
import {RoomHandler} from "../../../rooms/RoomHandler";

export class CreepUpgrader extends CreepSupport {
  public static getBodyParts(energyAvailable: number) {
    let bodyParts: string[] = [];
    let bodySegmentSize = 200;

    if (energyAvailable < bodySegmentSize) {
      return undefined;
    }

    let bodyPartsSize = 0;

    let count = 0; // This is used to enforce the 15 energy per tick cap.

    while (bodyPartsSize + bodySegmentSize < energyAvailable && count++ <= 15) {
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

  protected readonly STATE_UPGRADING = "UPGRADING";
  protected readonly STATE_REFUELING = "REFUELING";

  constructor (creep: Creep, roomHandler: RoomHandler) {
    super(creep, roomHandler);
  }

  public run() {
    super.run();

    let state = this.creep.memory.state || this.STATE_REFUELING;

    if (state === this.STATE_REFUELING) {
      this.getEnergy(this.creep);
    } else if (state === this.STATE_UPGRADING) {
      let controller = <Controller> this.creep.room.controller;
      this.moveToUpgrade(this.creep, controller);
    }

    if (this.creep.carry[RESOURCE_ENERGY] || 0 > 0) {
      this.creep.memory.state = this.STATE_UPGRADING;
    } else {
      this.creep.memory.state = this.STATE_REFUELING;
    }
  }

  public getEnergy(creep: Creep): void {
    let pathToContainer = undefined;
    let container = undefined;
    let containers = creep.room.find<Container>(FIND_STRUCTURES, {
      filter: (c: Container) => (c.structureType === STRUCTURE_CONTAINER
      && c.store[RESOURCE_ENERGY] > 0
      && c.pos.isNearTo(creep.pos)),
    });
    // TODO: Check if doing findClosestByPath with zero length array results in undefined, null or an error.
    if (containers.length > 0) {
      container = creep.pos.findClosestByPath<Container>(containers);
      if (container) {
        pathToContainer = creep.pos.findPathTo(container);
      }
    }

    // Get path to storage.
    let pathToStorage = undefined;
    let storage = creep.room.storage;
    if (storage) {
      pathToStorage = creep.pos.findPathTo(storage);
    }

    if (pathToContainer === undefined && pathToStorage === undefined) {
      return;
    }

    if (container !== undefined) {
      this.moveToWithdraw(creep, container);
      return;
    }

    this.moveToWithdrawFromStorage(creep, <Storage> storage);
    return;
  }

  public tryUpgrade(creep: Creep, target: Controller): number {
    return creep.upgradeController(target);
  }

  public moveToUpgrade(creep: Creep, target: Controller): void {
    if (this.tryUpgrade(creep, target) === ERR_NOT_IN_RANGE) {
      this.moveTo(creep, target.pos);
    }
  }
}
