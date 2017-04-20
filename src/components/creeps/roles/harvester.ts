import * as creepActions from "../creepActions";
import * as creepEnergyActions from "../creepEnergyActions";

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
    filter: (s: StructureExtension) => s.structureType === STRUCTURE_EXTENSION && s.energy < s.energyCapacity,
  });
  let containers = creep.room.find<StructureContainer>(FIND_STRUCTURES, {
    filter: (s: StructureContainer) => s.structureType === STRUCTURE_CONTAINER && _.sum(s.store) < s.storeCapacity,
  });
  let towers = creep.room.find<Tower>(FIND_STRUCTURES, {
    filter: (s: Tower) => s.structureType === STRUCTURE_TOWER && s.energy < s.energyCapacity,
  });

  if (creepActions.isRenewing(creep)) {
    creepActions.moveToRenew(creep, spawn);
  } else if (_.sum(creep.carry) === creep.carryCapacity) {
    if (spawn.energy < spawn.energyCapacity) {
      creepEnergyActions.moveToDropEnergy(creep, spawn);
    } else if (extensions.length > 0) {
      let extension = creep.pos.findClosestByPath<StructureExtension>(extensions);
      creepEnergyActions.moveToDropEnergy(creep, extension);
    } else if (containers.length > 0) {
      let container = creep.pos.findClosestByPath<StructureContainer>(containers);
      creepEnergyActions.moveToDropEnergy(creep, container);
    } else if (towers.length > 0) {
      let tower = creep.pos.findClosestByPath<Tower>(towers);
      creepEnergyActions.moveToDropEnergy(creep, tower);
    }
  } else {
    creepEnergyActions.moveToHarvest(creep, energySource);
  }
}
