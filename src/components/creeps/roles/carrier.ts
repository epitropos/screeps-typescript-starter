import * as creepActions from "../creepActions";

/**
 * Runs all creep actions.
 *
 * @export
 * @param {Creep} creep
 */
export function run(creep: Creep): void {
  let spawn = creep.room.find<Spawn>(FIND_MY_SPAWNS)[0];
  let extension = creep.pos.findClosestByPath<StructureExtension>(FIND_STRUCTURES, {
    filter: (s: StructureExtension) => s.structureType === STRUCTURE_EXTENSION && s.energy < s.energyCapacity
  });
  let container = creep.pos.findClosestByPath<Container>(FIND_STRUCTURES, {
    filter: (s: Container) => s.structureType === STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0
  });

  if (creepActions.needsRenew(creep)) {
    creepActions.moveToRenew(creep, spawn);
  } else if (spawn.energy < spawn.energyCapacity) {
      _moveToDropEnergy(creep, spawn);
  } else if (extension) {
    _moveToDropEnergy(creep, extension);
  } else {
    _moveToWithdraw(creep, container);
  }
}

function _tryWithdraw(creep: Creep, target: Container): number {
  return creep.withdraw(target, RESOURCE_ENERGY, creep.carryCapacity - _.sum(creep.carry));
}

function _moveToWithdraw(creep: Creep, target: Container): void {
  if (_tryWithdraw(creep, target) === ERR_NOT_IN_RANGE) {
    creepActions.moveTo(creep, target.pos);
  }
}

function _tryEnergyDropOff(creep: Creep, target: Spawn | Structure): number {
  return creep.transfer(target, RESOURCE_ENERGY);
}

function _moveToDropEnergy(creep: Creep, target: Spawn | Structure): void {
  if (_tryEnergyDropOff(creep, target) === ERR_NOT_IN_RANGE) {
    creepActions.moveTo(creep, target.pos);
  }
}
