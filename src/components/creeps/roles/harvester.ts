import * as creepActions from "../creepActions";
import * as creepEnergyActions from "../creepEnergyActions";
import * as roomActions from "../../rooms/roomActions";

/**
 * Runs all creep actions.
 *
 * @export
 * @param {Creep} creep
 */
export function run(creep: Creep): void {
  let spawn = creep.room.find<Spawn>(FIND_MY_SPAWNS)[0];

  if (creepActions.isRenewing(creep)) {
    creepActions.moveToRenew(creep, spawn);
    return;
  }

  if (_.sum(creep.carry) === creep.carryCapacity) {
    if (spawn.energy < spawn.energyCapacity) {
      creepEnergyActions.moveToDropEnergy(creep, spawn);
      return;
    }

    let extensions = roomActions.loadExtensions(creep.room);
    if (extensions.length > 0) {
      let extension = creep.pos.findClosestByPath<Extension>(extensions);
      creepEnergyActions.moveToDropEnergy(creep, extension);
      return;
    }

    let containers = roomActions.loadContainers(creep.room);
    if (containers.length > 0) {
      let container = creep.pos.findClosestByPath<Container>(containers);
      creepEnergyActions.moveToDropEnergy(creep, container);
      return;
    }

    let towers = roomActions.loadTowers(creep.room);
    if (towers.length > 0) {
      let tower = creep.pos.findClosestByPath<Tower>(towers);
      creepEnergyActions.moveToDropEnergy(creep, tower);
      return;
    }
  }

  let energySource = creep.pos.findClosestByPath<Source>(FIND_SOURCES_ACTIVE);
  creepEnergyActions.moveToHarvest(creep, energySource);
}
