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
  let controller = <Controller> creep.room.controller;
  let energySource = creep.pos.findClosestByPath<Source>(FIND_SOURCES_ACTIVE);

  // TODO: Change these to check current "task", and separate into "if" instead of "else if".
  // TODO: Change isRenewing from bool to use "task".
  if (creepActions.isRenewing(creep)) {
    creepActions.moveToRenew(creep, spawn);
  // TODO: Change these to check current task, and separate into "if" instead of "else if".
  } else if (_.sum(creep.carry) === creep.carryCapacity) {
    _moveToUpgrade(creep, controller);
  // TODO: Change these to check current task, and separate into "if" instead of "else if".
  } else {
    creepEnergyActions.moveToHarvest(creep, energySource);
  }
}

function _tryUpgrade(creep: Creep, target: Controller): number {
  return creep.upgradeController(target);
}

function _moveToUpgrade(creep: Creep, target: Controller): void {
  if (_tryUpgrade(creep, target) === ERR_NOT_IN_RANGE) {
    creepActions.moveTo(creep, target.pos);
  }
}
