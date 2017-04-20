// import * as Config from "../../config/config";
import * as creepActions from "./creepActions";

export function tryHarvest(creep: Creep, target: Source): number {
  return creep.harvest(target);
}

export function moveToHarvest(creep: Creep, target: Source): void {
  if (tryHarvest(creep, target) === ERR_NOT_IN_RANGE) {
    creepActions.moveTo(creep, target.pos);
  }
}

export function tryEnergyDropOff(creep: Creep, target: Spawn | Structure): number {
  return creep.transfer(target, RESOURCE_ENERGY);
}

export function moveToDropEnergy(creep: Creep, target: Spawn | Structure): void {
  if (tryEnergyDropOff(creep, target) === ERR_NOT_IN_RANGE) {
    creepActions.moveTo(creep, target.pos);
  }
}

export function moveToWithdraw(creep: Creep, target: Container): void {
  if (tryWithdraw(creep, target) === ERR_NOT_IN_RANGE) {
    creepActions.moveTo(creep, target.pos);
  }
}

export function tryWithdraw(creep: Creep, target: Container): number {
  return creep.withdraw(target, RESOURCE_ENERGY, creep.carryCapacity - _.sum(creep.carry));
}
