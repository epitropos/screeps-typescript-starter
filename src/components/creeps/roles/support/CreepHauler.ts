// import * as Config from "../../../../config/config";
// import {log} from "../../../../lib/logger/log";
import {CreepSupport} from "./CreepSupport";
import {RoomHandler} from "../../../rooms/RoomHandler";

export class CreepHauler extends CreepSupport {
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

      // let energySource = this.creep.pos.findClosestByPath<Source>(FIND_SOURCES, {
      //   filter: (s: Structure) =>
      //   (s.structureType === STRUCTURE_CONTAINER && (<StructureStorage>s).store[RESOURCE_ENERGY] > 0)
      //   || (s.structureType === STRUCTURE_STORAGE && (<StructureStorage>s).store[RESOURCE_ENERGY] > 0)
      //   || (s.structureType === STRUCTURE_LINK && (<StructureLink>s).energy > 0)
      // });
      // if (energySource) {
      //   this.moveToHarvest(this.creep, energySource);
      //   return;
      // }
      let stepsToContainer = Infinity;
      let closestContainer = this.creep.pos.findClosestByPath<Container>(FIND_MY_STRUCTURES, {
        filter: (s: Structure) => s.structureType === STRUCTURE_CONTAINER,
      });
      if (closestContainer) {
        let pathToContainer = this.creep.room.findPath(this.creep.pos, closestContainer.pos);
        stepsToContainer = pathToContainer.length;
      }

      let storage = this.creep.room.storage;
      let stepsToStorage = Infinity;
      if (storage) {
        let pathToStorage = this.creep.room.findPath(this.creep.pos, storage.pos);
        stepsToStorage = pathToStorage.length;
      }

      if (stepsToContainer === Infinity && stepsToStorage === Infinity) {
        return;
      } else if (stepsToContainer < stepsToStorage) {
        this.moveToWithdraw(this.creep, closestContainer);
      } else {
        this.moveToWithdrawFromStorage(this.creep, storage);
      }
    }

    if (state === this.STATE_DELIVERING) {
      let extensions = this.roomHandler.loadExtensions(this.creep.room);
      if (extensions.length > 0) {
        let extension = this.creep.pos.findClosestByPath<Extension>(extensions);
        this.moveToDropEnergy(this.creep, extension);
        return;
      }

      let spawn = this.creep.room.find<Spawn>(FIND_MY_SPAWNS)[0];
      if (spawn.energy < spawn.energyCapacity) {
        this.moveToDropEnergy(this.creep, spawn);
        return;
      }

      let towers = this.roomHandler.loadTowers(this.creep.room);
      if (towers.length > 0) {
        let tower = this.creep.pos.findClosestByPath<Tower>(towers);
        this.moveToDropEnergy(this.creep, tower);
        return;
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
