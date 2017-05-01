// import * as Config from "../../../../config/config";
import {log} from "../../../../lib/logger/log";
import {CreepSupport} from "./CreepSupport";
import {RoomHandler} from "../../../rooms/RoomHandler";

export class CreepUpgrader extends CreepSupport {
  public static getBodyParts(energyCapacityAvailable: number) {
    let bodyParts: string[] = [];
    let bodySegmentSize = 200;

    let sizeRemaining = energyCapacityAvailable;

    let bodyPartsSize = 0;

    while (sizeRemaining > 0 || bodyParts.length + 2 > 50) {
      bodyParts.push(WORK);
      bodyParts.push(CARRY);
      bodyParts.push(MOVE);
      bodyPartsSize += bodySegmentSize;
      sizeRemaining -= bodySegmentSize;
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

    let state = this.creep.memory.state = this.determineCurrentState(this.creep);

    if (state === this.STATE_REFUELING) {
      this.getEnergy(this.creep);
      return;
    }

    if (state === this.STATE_UPGRADING) {
      let controller = <Controller> this.creep.room.controller;
      this.moveToUpgrade(this.creep, controller);
      return;
    }
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

    if (this.roomHandler.controllerNeedsUpgrading(creep.room)) {
      return this.STATE_UPGRADING;
    }

    // TODO: Add STATE_IDLE
    // return STATE_IDLE;
    return this.STATE_UPGRADING;
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
      log.info("pathToContainer undefined");
      this.moveToWithdrawFromStorage(creep, <Storage> storage);
      return;
    }

    // if (pathToStorage === undefined) {
    //   log.info("pathToStorage undefined");
    //   this.moveToWithdraw(creep, <Container> container);
    //   return;
    // }

    // if (pathToContainer.length <= pathToStorage.length) {
    //   log.info("pathToContainer.length: " + pathToContainer.length + " <= pathToStorage.length: " + pathToStorage.length);
    //   this.moveToWithdraw(creep, <Container> container);
    //   return;
    // }

    log.info("default to storage");
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
