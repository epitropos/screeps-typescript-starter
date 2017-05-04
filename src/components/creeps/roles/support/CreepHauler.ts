// import * as Config from "../../../../config/config";
// import {log} from "../../../../lib/logger/log";
import {CreepSupport} from "./CreepSupport";
import {RoomHandler} from "../../../rooms/RoomHandler";

export class CreepHauler extends CreepSupport {
  public static getBodyParts(energyAvailable: number) {
    let bodyParts: string[] = [];
    let bodySegmentSize = 250;

    let bodyPartsSize = 0;

    while (bodyPartsSize + bodySegmentSize < energyAvailable) {
      bodyParts.push(CARRY);
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

  public readonly STATE_DELIVERING = "DELIVERING";
  public readonly STATE_REFUELING = "REFUELING";

  constructor (creep: Creep, roomHandler: RoomHandler) {
    super(creep, roomHandler);
  }

  public run() {
    super.run();

    let state = this.creep.memory.state || this.STATE_REFUELING;

    if (state === this.STATE_REFUELING) {
      // TODO: Change to isNearTo container id location.
      // TODO: Check if there is dropped energy on container location. I.e. the container is spilling over.
      // TODO: Retrieve dropped energy.
      // TODO: Retrieve energy from container.
      // TODO: Change to STATE_DELIVERING

      let droppedResource = this.creep.pos.findClosestByPath<Resource>(FIND_DROPPED_RESOURCES);
      if (droppedResource) {
        this.moveToPickup(this.creep, droppedResource);
        if (_.sum(this.creep.carry) > 0) {
          this.creep.memory.state = this.STATE_DELIVERING;
        }
        return;
      }

      // let droppedResource = this.creep.pos.findClosestByPath<Resource>(FIND_DROPPED_RESOURCES, {
      //   filter: (r: Resource) => r.resourceType !== RESOURCE_ENERGY,
      // });
      // if (droppedResource) {
      //   this.moveToPickup(this.creep, droppedResource);
      //   if (_.sum(this.creep.carry) === this.creep.carryCapacity) {
      //     this.creep.memory.state = this.STATE_DELIVERING;
      //     return;
      //   }
      // }

      // let droppedEnergy = this.creep.pos.findClosestByPath<Resource>(FIND_DROPPED_ENERGY, {
      //   filter: (r: Resource) => r.resourceType === RESOURCE_ENERGY && r.amount > 100,
      // });
      // if (droppedEnergy) {
      //   this.moveToPickup(this.creep, droppedEnergy);
      //   if (_.sum(this.creep.carry) === this.creep.carryCapacity) {
      //     this.creep.memory.state = this.STATE_DELIVERING;
      //     return;
      //   }
      // }

      // Go to assigned container.
      let containerId = this.creep.memory.containerId;
      let container = <Container> Game.getObjectById(containerId);
      if (!container) {
        this.creep.suicide();
      }

      this.moveToWithdraw(this.creep, container);
    } else if (state === this.STATE_DELIVERING) {
      // Go to storage.
      let storage = this.creep.room.storage;
      if (storage) {
        if (_.sum(storage.store) < storage.storeCapacity) {
          if (this.creep.carry[RESOURCE_ENERGY] || 0 < _.sum(this.creep.carry)) {
            this.moveToDropResource(this.creep, storage);
          }
          this.moveToDropEnergy(this.creep, storage);
        }
      }
    }

    if (this.creep.carry[RESOURCE_ENERGY] || 0 > 0) {
      this.creep.memory.state = this.STATE_DELIVERING;
    } else {
      this.creep.memory.state = this.STATE_REFUELING;
    }
  }
}
