import * as creepActions from "../creepActions";

/**
 * Runs all creep actions.
 *
 * @export
 * @param {Creep} creep
 */
export function run(creep: Creep): void {
  let spawn = creep.room.find<Spawn>(FIND_MY_SPAWNS)[0];
  let energySource = creep.pos.findClosestByPath<Source>(FIND_SOURCES_ACTIVE);
  let extensions = creep.room.find<StructureExtension>(FIND_STRUCTURES, {
    filter: (s: StructureExtension) => s.structureType === STRUCTURE_EXTENSION && s.energy < s.energyCapacity
  });
  let containers = creep.room.find<StructureContainer>(FIND_STRUCTURES, {
    filter: (s: StructureContainer) => s.structureType === STRUCTURE_CONTAINER && _.sum(s.store) < s.storeCapacity
  });

  if (creepActions.needsRenew(creep)) {
    creepActions.moveToRenew(creep, spawn);
  } else if (_.sum(creep.carry) === creep.carryCapacity) {
    if (spawn.energy < spawn.energyCapacity) {
      _moveToDropEnergy(creep, spawn);
    } else if (extensions.length > 0) {
      let extension = creep.pos.findClosestByPath<StructureExtension>(extensions);
      _moveToDropEnergy(creep, extension);
    } else if (containers.length > 0) {
      let container = creep.pos.findClosestByPath<StructureContainer>(containers);
      _moveToDropEnergy(creep, container);
    }
  } else {
    _moveToHarvest(creep, energySource);
  }
}

function _tryHarvest(creep: Creep, target: Source): number {
  return creep.harvest(target);
}

function _moveToHarvest(creep: Creep, target: Source): void {
  if (_tryHarvest(creep, target) === ERR_NOT_IN_RANGE) {
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
