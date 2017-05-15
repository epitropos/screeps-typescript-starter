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
    super.run();

    // TODO: Check current position for road. Create construction site if nothing.

    if (this.creep.memory.state === undefined || (this.creep.carry.energy || 0) === 0) {
      this.creep.memory.state = this.STATE_REFUELING;
    }

    if (this.creep.memory.state === this.STATE_REFUELING) {
      this.runRefueling(this.creep, this.roomHandler);
      return;
    }

    if (this.creep.memory.state === this.STATE_DELIVERING) {
      this.runDelivering(this.creep);
      return;
    }

    log.error("Unknown creep state: " + this.creep.memory.state);
  }

  public runRefueling(creep: Creep, roomHandler: RoomHandler) {
    if (this.creep.memory.finalDestination === undefined) {
      this.creep.memory.finalDestination = this.getFinalDestinationFromRefuelDestination(
        this.creep.pos,
        this.creep.memory.refuelPosition);
    }

    if (creep.memory.containerId === undefined) {
      this.loadContainer(creep, roomHandler);
    }

    if (creep.memory.containerId !== undefined) {
      let container = <Container> Game.getObjectById(creep.memory.containerId);
      if (_.sum(container.store) === container.storeCapacity) {
        this.tryWithdraw(creep, container);
        creep.memory.state = this.STATE_DELIVERING;
        // TODO: Fix after path is being stored in memory.
        creep.memory.finalDestination = undefined;
        return;
      }

      let droppedResource = this.loadDroppedResource(creep, roomHandler);
      if (droppedResource !== undefined) {
        this.tryPickup(creep, droppedResource);
        creep.memory.state = this.STATE_DELIVERING;
        // TODO: Fix after path is being stored in memory.
        creep.memory.finalDestination = undefined;
        return;
      }

      if (_.sum(container.store[RESOURCE_ENERGY]) > 0) {
        this.tryWithdraw(creep, container);
        creep.memory.state = this.STATE_DELIVERING;
        // TODO: Fix after path is being stored in memory.
        creep.memory.finalDestination = undefined;
        return;
      }
    }

    let droppedResource = this.loadDroppedResource(creep, roomHandler);
    if (droppedResource !== undefined) {
      this.tryPickup(creep, droppedResource);
    }

    if (creep.carry[RESOURCE_ENERGY] || 0 > 0) {
      creep.memory.state = this.STATE_DELIVERING;
      // TODO: Fix after path is being stored in memory.
      creep.memory.finalDestination = undefined;
    }
  }

  public runDelivering(creep: Creep) {
    // Load closest extension.
    let extension = this.loadExtension(creep);
    if (extension) {
      if (this.tryEnergyDropOff(creep, extension) === ERR_NOT_IN_RANGE) {
        this.moveTo(creep, extension);
      }
      return;
    }

    // Load closest spawn.
    let spawn = this.loadSpawn(creep);
    if (spawn) {
      if (this.tryEnergyDropOff(creep, spawn) === ERR_NOT_IN_RANGE) {
        this.moveTo(creep, spawn);
      }
      return;
    }

    // Load closest tower.
    let tower = this.loadTower(creep);
    if (tower) {
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
      if (this.tryEnergyDropOff(creep, storage) === ERR_NOT_IN_RANGE) {
        this.moveTo(creep, storage);
      }
      return;
    }
  }

  private loadContainer(creep: Creep, roomHandler: RoomHandler) {
    let containers = roomHandler.room.find<Container>(FIND_STRUCTURES, {
      filter: (c: Container) => c.structureType === STRUCTURE_CONTAINER
      && c.pos.isNearTo(creep),
    });
    if (containers.length > 0) {
      creep.memory.containerId = containers[0].id;
      return containers[0].id;
    }
    // TODO: Delete all but one container instead of ignoring them.

    return undefined;
  }

  // TODO: Need to create construction site because the hauler may stop too far away.
  private loadDroppedResource(creep: Creep, roomHandler: RoomHandler) {
    let droppedResources = roomHandler.room.find<Resource>(FIND_DROPPED_RESOURCES, {
      filter: (r: Resource) => r.pos.isNearTo(creep.pos),
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
    return creep.pos.findClosestByPath<Storage>(FIND_STRUCTURES, {
      filter: (s: Storage) => s.structureType === STRUCTURE_STORAGE
        && s.isActive // In case the RCL drops and deactivates this structure.
        && s.store[RESOURCE_ENERGY] || 0 < _.sum(s.store),
    });
  }

  private loadTower(creep: Creep) {
    return creep.pos.findClosestByPath<Tower>(FIND_STRUCTURES, {
      filter: (t: Tower) => t.structureType === STRUCTURE_TOWER
        && t.isActive // In case the RCL drops and deactivates this structure.
        && t.energy < t.energyCapacity,
    });
  }

  private getFinalDestinationFromRefuelDestination(
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
}
