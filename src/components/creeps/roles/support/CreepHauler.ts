// import * as Config from "../../../../config/config";
import {log} from "../../../../lib/logger/log";
import {CreepSupport} from "./CreepSupport";
import {RoomHandler} from "../../../rooms/RoomHandler";

export class CreepHauler extends CreepSupport {
  public static getBodyParts(energyCapacityAvailable: number) {
    let bodyParts: string[] = [];
    let bodySegmentSize = 250;

    let sizeRemaining = energyCapacityAvailable;

    let bodyPartsSize = 0;

    while (sizeRemaining > 0 || bodyParts.length + 2 > 50) {
      bodyParts.push(CARRY);
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

  public readonly STATE_DELIVERING = "DELIVERING";
  public readonly STATE_REFUELING = "REFUELING";

  constructor (creep: Creep, roomHandler: RoomHandler) {
    super(creep, roomHandler);
  }

  public run() {
    super.run();

    let state = this.creep.memory.state = this.determineCurrentState(this.creep);

    if (state === this.STATE_REFUELING) {
      let droppedEnergy = this.creep.pos.findClosestByPath<Resource>(FIND_DROPPED_ENERGY,
        {filter: (r: Resource) => r.resourceType === RESOURCE_ENERGY});
      if (droppedEnergy) {
        this.moveToPickup(this.creep, droppedEnergy);
        return;
      }

      let containers = this.creep.room.find<Container>(FIND_STRUCTURES, {
        filter: (c: Container) => c.structureType === STRUCTURE_CONTAINER && c.store[RESOURCE_ENERGY] > 0,
      });

      if (containers) {
        let container = this.creep.pos.findClosestByPath(containers);
        if (container) {
          log.info("moveToWithdraw from " + container.structureType +
          " at (" + container.pos.x + "," + container.pos.y + ")");
          this.moveToWithdraw(this.creep, container);
        } else {
          log.info("container is null");
        }
      } else {
        log.info("ARGH");
      }
    }

    if (state === this.STATE_DELIVERING) {
      let storage = this.creep.room.storage;
      if (storage) {
        if (_.sum(storage.store) < storage.storeCapacity) {
          this.moveToDropEnergy(this.creep, storage);
        }
      }
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

    if (this.refuelingComplete) {
      return this.STATE_DELIVERING;
    }

    // TODO: Add STATE_IDLE
    // return STATE_IDLE;
    return this.STATE_DELIVERING;
  }
}
