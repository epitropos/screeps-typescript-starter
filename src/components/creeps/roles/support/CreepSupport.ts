// import * as Config from "../../../../config/config";
// import {log} from "../../../../lib/logger/log";
import {CreepBase} from "../CreepBase";
import {RoomHandler} from "../../../rooms/RoomHandler";

export class CreepSupport extends CreepBase {
  constructor (creep: Creep, roomHandler: RoomHandler) {
    super(creep, roomHandler);
  }

  public run() {
    super.run();
  }

  public tryHarvestMineral(creep: Creep, target: Mineral): number {
    return creep.harvest(target);
  }

  public tryHarvest(creep: Creep, target: Source): number {
    return creep.harvest(target);
  }

  public moveToHarvest(creep: Creep, target: Source): void {
    if (this.tryHarvest(creep, target) === ERR_NOT_IN_RANGE) {
      this.moveTo(creep, target.pos);
    }
  }

  public tryResourceDropOff(creep: Creep, target: Spawn | Structure): number {
    let resource = _.findKey(this.creep.carry);
    let amountTransferred = creep.transfer(target, resource);
    // log.info(creep.name + " transferred " + amountTransferred)
    if (amountTransferred) {
      return amountTransferred;
    } else {
      return 0;
    }
  }

  public tryEnergyDropOff(creep: Creep, target: Spawn | Structure): number {
    return creep.transfer(target, RESOURCE_ENERGY);
  }

  public moveToDropResource(creep: Creep, target: Spawn | Structure): void {
    if (this.tryResourceDropOff(creep, target) === ERR_NOT_IN_RANGE) {
      this.moveTo(creep, target.pos);
    }
  }

  public moveToDropEnergy(creep: Creep, target: Spawn | Structure): void {
    if (this.tryEnergyDropOff(creep, target) === ERR_NOT_IN_RANGE) {
      this.moveTo(creep, target.pos);
    }
  }

  public moveToWithdrawFromStorage(creep: Creep, storage: Storage | StructureStorage | undefined): void {
    if (storage === undefined) {
      return;
    }

    if (this.tryToWithdrawFromStorage(creep, storage) === ERR_NOT_IN_RANGE) {
      this.moveTo(creep, storage.pos);
    }
  }

  public tryToWithdrawFromStorage(creep: Creep, storage: Storage | StructureStorage): number {
    if (storage) {
      let amountToWithdraw = creep.carryCapacity - _.sum(creep.carry);
      let amountInStorage = storage.store[RESOURCE_ENERGY] || 0;
      if (amountInStorage < amountToWithdraw) {
        amountToWithdraw = amountInStorage;
      }
      return creep.withdraw(storage, RESOURCE_ENERGY, amountToWithdraw);
    }
    return 0;
  }

  public moveToWithdraw(creep: Creep, target: Container): void {
    let isNearTo = creep.pos.isNearTo(target.pos);
    if (isNearTo) {
      this.tryWithdraw(creep, target);
    } else {
      // TODO: Consider storing path in memory and re-pathing if creep does not move for X ticks.
      this.moveTo(creep, target);
    }
    // log.info(creep.name + " - tryWithdraw - " + target);
    // let withdrawalResult = this.tryWithdraw(creep, target);
    // log.info(withdrawalResult);
    // if (withdrawalResult === ERR_NOT_IN_RANGE) {
    //   log.info(creep.name + " - moveTo - " + target.pos);
    //   let moveToResult = this.moveTo(creep, target.pos);
    //   log.info(moveToResult);
    // }
  }

  public tryWithdraw(creep: Creep, target: Container): number {
    // if (target) {
    //   let amountToWithdraw = creep.carryCapacity - _.sum(creep.carry);
    //   if (amountToWithdraw > target.store[RESOURCE_ENERGY]) {
    //     amountToWithdraw = target.store[RESOURCE_ENERGY];
    //   }
    //   return creep.withdraw(target, RESOURCE_ENERGY, amountToWithdraw);
    // }
    if (target) {
      let key = _.findKey(target.store);
      let amountToWithdraw = creep.carryCapacity - _.sum(creep.carry);
      if (amountToWithdraw > target.store[key]) {
        amountToWithdraw = target.store[key];
      }
      creep.withdraw(target, key, amountToWithdraw);
    }
    return 0;
  }
}
