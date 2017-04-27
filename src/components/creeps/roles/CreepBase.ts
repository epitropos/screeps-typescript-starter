import * as C from "../../../config/constants";
import * as Config from "../../../config/config";
// import {log} from "../../../lib/logger/log";
import {RoomHandler} from "../../rooms/RoomHandler";

export class CreepBase {
  public creep: Creep;
  public roomHandler: RoomHandler;

  constructor (creep: Creep, roomHandler: RoomHandler) {
    this.creep = creep;
    this.roomHandler = roomHandler;
  }

  public run() {
    this.creep.say(this.creep.name);
  }

  /**
   * Shorthand method for `Creep.moveTo()`.
   *
   * @export
   * @param {Creep} creep
   * @param {(Structure | RoomPosition)} target
   * @returns {number}
   */
  public moveTo(creep: Creep, target: Structure | RoomPosition): number {
    let result: number = 0;

    // Execute moves by cached paths at first
    result = creep.moveTo(target, {visualizePathStyle: {stroke: C.BRIGHTRED}});

    return result;
  }

  // TODO: Change this to needsMoreCargo.
  public needsToRefuel(creep: Creep): boolean {
    return (_.sum(creep.carry) === 0);
  }

  public refuelingComplete(creep: Creep): boolean {
    return (_.sum(creep.carry) === creep.carryCapacity);
  }

  /**
   * Returns true if the `ticksToLive` of a creep has dropped below the renew
   * limit set in config.
   *
   * @export
   * @param {Creep} creep
   * @returns {boolean}
   */
  public needsRenew(creep: Creep): boolean {
    return (creep.ticksToLive < Config.DEFAULT_MIN_LIFE_BEFORE_NEEDS_REFILL);
  }

  /**
   * Returns true if the `ticksToLive` of a creep is above the refill mark set in config.
   *
   * @export
   * @param {Creep} creep
   * @returns {boolean}
   */
  public renewComplete(creep: Creep): boolean {
    return (creep.ticksToLive >= Config.DEFAULT_REFILL_LIFE_TO);
  }

  /**
   * Shorthand method for `renewCreep()`.
   *
   * @export
   * @param {Creep} creep
   * @param {Spawn} spawn
   * @returns {number}
   */
  public tryRenew(creep: Creep, spawn: Spawn): number {
    return spawn.renewCreep(creep);
  }

  /**
   * Moves a creep to a designated renew spot (in this case the spawn).
   *
   * @export
   * @param {Creep} creep
   * @param {Spawn} spawn
   */
  public moveToRenew(creep: Creep, spawn: Spawn): void {
    if (this.tryRenew(creep, spawn) === ERR_NOT_IN_RANGE) {
      creep.moveTo(spawn, {visualizePathStyle: {stroke: C.BRIGHTRED}});
    }
  }

  public tryPickup(creep: Creep, resource: Resource): number {
    return creep.pickup(resource);
  }

  public moveToPickup(creep: Creep, resource: Resource): void {
    if (this.tryPickup(creep, resource) === ERR_NOT_IN_RANGE) {
      creep.moveTo(resource, {visualizePathStyle: {stroke: C.BRIGHTRED}});
    }
  }

  /**
   * Attempts transferring available resources to the creep.
   *
   * @export
   * @param {Creep} creep
   * @param {RoomObject} roomObject
   */
  public getEnergy(creep: Creep, roomObject: RoomObject): void {
    let energy: Resource = <Resource> roomObject;

    if (energy) {
      if (creep.pos.isNearTo(energy)) {
        creep.pickup(energy);
      } else {
        this.moveTo(creep, energy.pos);
      }
    }
  }

  /**
   * Returns true if a creep's `working` memory entry is set to true, and false
   * otherwise.
   *
   * @export
   * @param {Creep} creep
   * @returns {boolean}
   */
  public canWork(creep: Creep): boolean {
    let working = creep.memory.working;

    if (working && _.sum(creep.carry) === 0) {
      creep.memory.working = false;
      return false;
    } else if (!working && _.sum(creep.carry) === creep.carryCapacity) {
      creep.memory.working = true;
      return true;
    } else {
      return creep.memory.working;
    }
  }

  /**
   * Returns true if the creep is in the "renewing" state.
   *
   * @export
   * @param {Creep} creep
   * @returns {boolean}
   */
  public isRenewing(creep: Creep): boolean {
    if (this.needsRenew(creep)) {
      creep.memory.isRenewing = true;
      return true;
    } else if (this.renewComplete(creep)) {
      creep.memory.isRenewing = false;
      return false;
    }
    return creep.memory.isRenewing;
  }
}
