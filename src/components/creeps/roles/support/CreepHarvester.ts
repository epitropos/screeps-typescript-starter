// import * as Config from "../../../../config/config";
import {log} from "../../../../lib/logger/log";
import {CreepSupport} from "./CreepSupport";
import {RoomHandler} from "../../../rooms/RoomHandler";

export class CreepHarvester extends CreepSupport {
  // TODO: Change into a shared enum.
  public readonly STATE_DELIVERING = "DELIVERING";
  public readonly STATE_REFUELING = "REFUELING";

  constructor (creep: Creep, roomHandler: RoomHandler) {
    super(creep, roomHandler);
  }

  public run() {
    super.run();

    let state = this.creep.memory.state = this.determineCurrentState(this.creep);

    // let spawn = this.creep.room.find<Spawn>(FIND_MY_SPAWNS)[0];

    if (state === this.STATE_REFUELING) {
      log.info("find dropped energy");
      let droppedEnergy = this.creep.pos.findClosestByPath<Resource>(FIND_DROPPED_ENERGY,
        {filter: (r: Resource) => r.resourceType === RESOURCE_ENERGY});
      if (droppedEnergy) {
        this.moveToPickup(this.creep, droppedEnergy);
        return;
      }

      log.info("find energy source");
      let energySource = this.creep.pos.findClosestByPath<Source>(FIND_SOURCES_ACTIVE);
      if (energySource) {
        this.moveToHarvest(this.creep, energySource);
        return;
      }
    }

    if (state === this.STATE_DELIVERING) {
      // let extensions = this.roomHandler.loadExtensions(this.creep.room);
      // if (extensions.length > 0) {
      //   let extension = this.creep.pos.findClosestByPath<Extension>(extensions);
      //   this.moveToDropEnergy(this.creep, extension);
      //   return;
      // }

      // if (spawn.energy < spawn.energyCapacity) {
      //   this.moveToDropEnergy(this.creep, spawn);
      //   return;
      // }

      // let towers = this.roomHandler.loadTowers(this.creep.room);
      // if (towers.length > 0) {
      //   let tower = this.creep.pos.findClosestByPath<Tower>(towers);
      //   this.moveToDropEnergy(this.creep, tower);
      //   return;
      // }

      // let containers = this.roomHandler.loadContainersWithSpace(this.creep.room);
      // if (containers.length > 0) {
      //   let container = this.creep.pos.findClosestByPath<Container>(containers);
      //   this.moveToDropEnergy(this.creep, container);
      //   return;
      // }

      // if (this.creep.room.storage) {
      //   this.moveToDropEnergy(this.creep, this.creep.room.storage);
      //   return;
      // }

      // TODO: Cache this.
      let containers = this.creep.room.find<Container>(FIND_STRUCTURES, {
        filter: (s: Structure) => s.structureType === STRUCTURE_CONTAINER,
      });
      log.info("find closest container");
      let closestContainer = this.creep.pos.findClosestByPath(containers);
      log.info("find closest container path");
      let closestContainerPath = this.creep.room.findPath(this.creep.pos, closestContainer.pos);

      // TODO: Cache this.
      let storage = this.creep.room.find<Storage>(FIND_STRUCTURES, {
        filter: (s: Structure) => s.structureType === STRUCTURE_STORAGE,
      });
      log.info("find closest storage");
      let closestStorage = this.creep.pos.findClosestByPath(storage);
      log.info("find closest storage path");
      let closestStoragePath = this.creep.room.findPath(this.creep.pos, closestStorage.pos);

      if (closestContainerPath < closestStoragePath) {
        this.moveToDropEnergy(this.creep, closestContainer);
      } else {
        this.moveToDropEnergy(this.creep, closestStorage);
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
