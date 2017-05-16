// import * as C from "../../../../config/constants";
// import * as Config from "../../../../config/config";
import {log} from "../../../../lib/logger/log";
import {CreepSupport} from "./CreepSupport";
import {RoomHandler} from "../../../rooms/RoomHandler";

export class CreepHauler extends CreepSupport {
  public static getBodyParts(energyAvailable: number) {
    let bodyParts: string[] = [];
    let bodySegmentSize = 150;

    if (energyAvailable < bodySegmentSize) {
      return undefined;
    }

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
    log.info("run 1");
    super.run();

    log.info("run 2");
    let storage = this.loadStorage(this.creep);
    if (storage) {
      log.info("run 3");
      // Deposit non-energy resources into storage.
      if (this.isFull(this.creep) && this.carryingNonEnergyResource(this.creep)) {
        log.info("run 4");
        this.tryResourceDropOff(this.creep, storage);
        return;
      }

      log.info("run 5");
      // Look for dropped resources.
      let droppedResource = this.loadDroppedResource(this.creep, 100, this.roomHandler);
      if (droppedResource !== undefined) {
        log.info("run 6");
        this.moveToPickup(this.creep, droppedResource);
        return;
      } else {
        log.info("run 7");
        // Deposit non-energy resources into storage.
        if (this.carryingNonEnergyResource(this.creep)) {
          log.info("run 8");
          this.tryResourceDropOff(this.creep, storage);
          return;
        }
      }
    }

    log.info("run 9");
    // Default state to refueling.
    if (this.creep.memory.state === undefined) {
      log.info("run 10");
      this.creep.memory.state = this.STATE_REFUELING;
    }

    log.info("run 11");
    if (this.creep.memory.state === this.STATE_REFUELING) {
      log.info("run 12");
      this.runRefueling(this.creep, this.roomHandler);
      if (this.doesCreepHaveEnergy(this.creep)) {
        log.info("run 13");
        this.creep.memory.state = this.STATE_DELIVERING;
      }
      return;
    }

    log.info("run 4");
    if (this.creep.memory.state === this.STATE_DELIVERING) {
      log.info("run 15");
      this.runDelivering(this.creep);
      if (this.isEmpty(this.creep)) {
        log.info("run 16");
        this.creep.memory.state = this.STATE_REFUELING;
      }
      return;
    }

    log.error("Unknown creep state: " + this.creep.memory.state);

    // // Default to refueling state.
    // let energyCarried = this.creep.carry[RESOURCE_ENERGY] || 0;
    // if (this.creep.memory.state === undefined || energyCarried === 0) {
    //   this.creep.memory.state = this.STATE_REFUELING;
    // } else if (energyCarried > 0) {
    //   this.creep.memory.state = this.STATE_DELIVERING;
    // }

    // switch (this.creep.memory.state) {
    //   case this.STATE_REFUELING: this.runRefueling(this.creep, this.roomHandler); return;
    //   case this.STATE_DELIVERING: this.runDelivering(this.creep); return;
    //   default: log.error("Unknown creep state: " + this.creep.memory.state);
    // }
  }

  public runRefueling(creep: Creep, roomHandler: RoomHandler) {
    log.info("runRefueling 1");
    // Move to refuel position.
    if (this.creep.memory.finalDestination === undefined
    && !this.creep.pos.inRangeTo(this.creep.memory.refuelPosition, 1)) {
    // && !this.isSamePosition(this.creep.pos, this.creep.memory.refuelPosition)) {
      log.info("runRefueling 2");
      let finalDestination = this.getFinalDestinationFromRefuelPosition(
        this.creep.pos,
        this.creep.memory.refuelPosition);
      // this.creep.memory.finalDestination.x = finalDestination.x;
      // this.creep.memory.finalDestination.y = finalDestination.y;
      // this.creep.memory.finalDestination.roomName = finalDestination.roomName;
      this.moveTo(this.creep, finalDestination);
      return;
    }

    log.info("runRefueling 3");
    let cargoSpaceAvailable = creep.carryCapacity - _.sum(creep.carry);

    // Withdraw energy from container if it is full.
    let container = this.loadContainerNextToCreep(creep, roomHandler);
    if (container && this.isContainerFullOfEnergy(container)) {
      log.info("runRefueling 4");
      // TODO: Combine this code with doesContainerHaveEnergy
      let energyAvailable = container.store[RESOURCE_ENERGY] || 0;
      let energyToWithdraw = _.min({cargoSpaceAvailable, energyAvailable});
      if (energyToWithdraw > 0) {
        creep.withdraw(container, RESOURCE_ENERGY, cargoSpaceAvailable);
        return;
      }
    }

    // Pickup overflow energy.
    log.info("runRefueling 5");
    let droppedEnergy = this.loadDroppedEnergy(creep, roomHandler, 1);
    if (droppedEnergy) {
      log.info("runRefueling 6");
      creep.pickup(droppedEnergy);
      return;
    }

    // Nothing overflowing. Withdraw energy from container.
    log.info("runRefueling 7");
    if (container && this.doesContainerHaveEnergy(container)) {
      log.info("runRefueling 8");
      // TODO: Combine this code with isContainerFullOfEnergy
      let energyAvailable = container.store[RESOURCE_ENERGY] || 0;
      let energyToWithdraw = _.min({cargoSpaceAvailable, energyAvailable});
      if (energyToWithdraw > 0) {
        log.info("runRefueling 9");
        creep.withdraw(container, RESOURCE_ENERGY, cargoSpaceAvailable);
        return;
      }
    }
  }

  public runDelivering(creep: Creep) {
    // // Drop off non-energy cargo.
    // let carriedEnergy = creep.carry[RESOURCE_ENERGY] || 0;
    // let totalCarried = _.sum(creep.carry);
    // if (carriedEnergy < totalCarried) {
    //   let storage = this.loadStorage(creep);
    //   if (storage) {
    //     log.info("Delivering non-energy resource to storage.");
    //     if (this.tryResourceDropOff(creep, storage) === ERR_NOT_IN_RANGE) {
    //       this.moveTo(creep, storage);
    //     }
    //     return;
    //   }
    // }

    // Load closest extension.
    let extension = this.loadExtension(creep);
    if (extension) {
      log.info("Delivering energy resource to extension.");
      if (this.tryEnergyDropOff(creep, extension) === ERR_NOT_IN_RANGE) {
        this.moveTo(creep, extension);
      }
      return;
    }

    // Load closest spawn.
    let spawn = this.loadSpawn(creep);
    if (spawn) {
      log.info("Delivering energy resource to spawn.");
      if (this.tryEnergyDropOff(creep, spawn) === ERR_NOT_IN_RANGE) {
        this.moveTo(creep, spawn);
      }
      return;
    }

    // Load closest tower.
    let tower = this.loadTower(creep);
    if (tower) {
      log.info("Delivering energy resource to tower.");
      if (this.tryEnergyDropOff(creep, tower) === ERR_NOT_IN_RANGE) {
        this.moveTo(creep, tower);
      }
      return;
    }

    // Load closest outbound container.
    // TODO: Code goes here.

    // Load storage.
    let storage = this.loadStorage(creep);
    if (storage) {
      let result = this.tryEnergyDropOff(creep, storage);
      if (result === ERR_NOT_IN_RANGE) {
        this.moveTo(creep, storage);
      }
      return;
    }
  }

  private loadContainerNextToCreep(creep: Creep, roomHandler: RoomHandler) {
    let containers = roomHandler.room.find<Container>(FIND_STRUCTURES, {
      filter: (c: Container) => c.structureType === STRUCTURE_CONTAINER
      && c.pos.isNearTo(creep),
    });
    if (containers.length > 0) {
      // creep.memory.containerId = containers[0].id;
      // return containers[0].id;
      return containers[0];
    }
    // TODO: Delete all but one container instead of ignoring them.

    return undefined;
  }

  // TODO: Need to create construction site because the hauler may stop too far away.
  private loadDroppedEnergy(creep: Creep, roomHandler: RoomHandler, range: number) {
    let droppedResources = roomHandler.room.find<Resource>(FIND_DROPPED_ENERGY, {
      filter: (r: Resource) => r.pos.inRangeTo(creep.pos, range),
    });
    if (droppedResources.length > 0) {
      return droppedResources[0];
    }

    return undefined;
  }

  private loadDroppedResource(creep: Creep, range: number, roomHandler: RoomHandler) {
    let droppedResources = roomHandler.room.find<Resource>(FIND_DROPPED_RESOURCES, {
      filter: (r: Resource) => r.resourceType !== RESOURCE_ENERGY && r.pos.inRangeTo(creep, range),
    });
    if (droppedResources.length > 0) {
      return droppedResources[0];
    }

    return undefined;
  }

  private loadExtension(creep: Creep) {
    return creep.pos.findClosestByPath<Extension>(FIND_STRUCTURES, {
      filter: (e: Extension) => e.structureType === STRUCTURE_EXTENSION
        && e.isActive // In case the RCL drops and deactivates this structure.
        && e.energy < e.energyCapacity,
    });
  }

  private loadSpawn(creep: Creep) {
    return creep.pos.findClosestByPath<Spawn>(FIND_MY_SPAWNS, {
      filter: (s: Spawn) => s.energy < s.energyCapacity,
    });
  }

  private loadStorage(creep: Creep) {
    let storages = creep.room.find<Storage>(FIND_MY_STRUCTURES, {
      filter: (s: Storage) => s.structureType === STRUCTURE_STORAGE
      && (s.store[RESOURCE_ENERGY] || 0) < _.sum(s.store),
    });
    if (storages.length > 0) {
      return storages[0];
    }

    return undefined;
    // return creep.pos.findClosestByPath<Storage>(FIND_STRUCTURES, {
    //   filter: (s: Storage) => s.structureType === STRUCTURE_STORAGE
    //     && s.isActive // In case the RCL drops and deactivates this structure.
    //     && s.store[RESOURCE_ENERGY] || 0 < _.sum(s.store),
    // });
  }

  private loadTower(creep: Creep) {
    return creep.pos.findClosestByPath<Tower>(FIND_STRUCTURES, {
      filter: (t: Tower) => t.structureType === STRUCTURE_TOWER
        && t.isActive // In case the RCL drops and deactivates this structure.
        && t.energy < t.energyCapacity,
    });
  }

  private getFinalDestinationFromRefuelPosition(
    currentPosition: RoomPosition,
    refuelPosition: RoomPosition) {
    let oldX = currentPosition.x;
    let oldY = currentPosition.y;
    let oldRoomName = currentPosition.roomName;
    let oldPosition = new RoomPosition(oldX, oldY, oldRoomName);

    let newX = refuelPosition.x;
    let newY = refuelPosition.y;
    let newRoomName = refuelPosition.roomName;
    let newPosition = new RoomPosition(newX, newY, newRoomName);

    if (oldPosition.inRangeTo(newPosition, 1)) {
      return oldPosition;
    }

    let path = oldPosition.findPathTo(newPosition);
    let step = path[path.length - 2];
    let actualPosition = new RoomPosition(step.x, step.y, newRoomName);
    return actualPosition;
  }

  private isEmpty(creep: Creep) {
    let energyCarried = creep.carry[RESOURCE_ENERGY] || 0;
    if (energyCarried === 0) {
      return true;
    }
    return false;
  }

  // private isCreepFullOfEnergy(creep: Creep) {
  //   let carriedEnergy = creep.carry[RESOURCE_ENERGY] || 0;
  //   if (carriedEnergy === creep.carryCapacity) {
  //     return true;
  //   }
  //   return false;
  // }

  private isContainerFullOfEnergy(container: Container) {
    let storedEnergy = container.store[RESOURCE_ENERGY] || 0;
    if (storedEnergy === container.storeCapacity) {
      return true;
    }
    return false;
  }

  private doesCreepHaveEnergy(creep: Creep) {
    let carriedEnergy = creep.carry[RESOURCE_ENERGY] || 0;
    if (carriedEnergy > 0) {
      return true;
    }
    return false;
  }

  private doesContainerHaveEnergy(container: Container) {
    let storedEnergy = container.store[RESOURCE_ENERGY] || 0;
    if (storedEnergy > 0) {
      return true;
    }
    return false;
  }
}
