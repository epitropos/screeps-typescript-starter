/*
import * as Config from "../../../config/config";

import { log } from "../../../lib/logger/log";
*/

import * as creepActions from "../creepActions";

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

  if (creepActions.needsRenew(creep)) {
    /*
    if (Config.ENABLE_DEBUG_MODE) {
      log.info(creep.name + " needs renewing");
    }
    */
    creepActions.moveToRenew(creep, spawn);
  } else if (_.sum(creep.carry) === creep.carryCapacity) {
    /*
    if (Config.ENABLE_DEBUG_MODE) {
      log.info(creep.name + " upgrading controller at (" + controller.pos.x + "," + controller.pos.y + ")");
    }
    */
    _moveToUpgrade(creep, controller);
  } else {
    /*
    if (Config.ENABLE_DEBUG_MODE) {
      log.info(creep.name + " harvesting energy source at (" + energySource.pos.x + "," + energySource.pos.y + ")");
    }
    */
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

function _tryUpgrade(creep: Creep, target: Controller): number {
  return creep.upgradeController(target);
}

function _moveToUpgrade(creep: Creep, target: Controller): void {
  if (_tryUpgrade(creep, target) === ERR_NOT_IN_RANGE) {
    creepActions.moveTo(creep, target.pos);
  }
}
