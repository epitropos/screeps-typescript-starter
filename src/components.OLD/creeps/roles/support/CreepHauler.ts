// import * as C from "../../../../config/constants";
// // import * as Config from "../../../../config/config";
// import {log} from "../../../../lib/logger/log";
// import {CreepSupport} from "./CreepSupport";
// import {RoomHandler} from "../../../rooms/RoomHandler";

// export class CreepHauler extends CreepSupport {
//   public static MinimumEnergyRequired = 150;
//   public CarriedEnergy: number = 0;
//   public CarriedMinerals: number = 0;
//   public CarriedTotal: number = 0;

//   public static getBodyParts(energyAvailable: number) {
//     if (energyAvailable < CreepHauler.MinimumEnergyRequired) {
//       return undefined;
//     }

//     let bodyParts: string[] = [];
//     let bodySegmentSize = 150;

//     let bodyPartsSize = 0;

//     while (bodyPartsSize + bodySegmentSize <= energyAvailable) {
//       bodyParts.push(CARRY);
//       bodyParts.push(CARRY);
//       bodyParts.push(MOVE);
//       bodyPartsSize += bodySegmentSize;
//     }

//     // TODO: Move function into CreepSupport.
//     return _.sortBy(bodyParts, function(bodyPart) {
//       switch (bodyPart) {
//         case CARRY: return 2;
//         case MOVE: return 3;
//         case WORK: return 1;
//         default: return 99;
//       }
//     });
//   }

//   constructor (creep: Creep, roomHandler: RoomHandler) {
//     super(creep, roomHandler);

//     this.CarriedTotal = _.sum(creep.carry);
//     this.CarriedEnergy = creep.carry[RESOURCE_ENERGY] || 0;
//     this.CarriedMinerals = this.CarriedTotal - this.CarriedEnergy;
//   }

//   private determineState() {
//     if (this.CarriedMinerals > 0) {
//       return C.STATE_DELIVERING;
//     }

//     if (this.CarriedEnergy > 0) {
//       return C.STATE_DELIVERING;
//     }

//     return C.STATE_REFUELING;
//   }

//   private deliverEnergy(creep: Creep) {
//     let targetId = creep.memory.targetId;
//     let target = <Structure> Game.getObjectById(targetId);
//     if (!target) {
//       creep.memory.targetId = targetId = this.determineEnergyDeliveryTarget(creep);
//       target = <Structure> Game.getObjectById(targetId);
//     }
//     if (!target) {
//       return;
//     }

//     if (this.tryEnergyDropOff(creep, target) === ERR_NOT_IN_RANGE) {
//       this.moveTo(creep, target);
//     }
//   }

//   private determineEnergyDeliveryTarget(creep: Creep) {
//     let tower = this.loadTower(creep);
//     if (tower) {
//       return tower.id;
//     }

//     let extension = this.loadExtension(creep);
//     if (extension) {
//       return extension;
//     }

//     let spawn = this.loadSpawn(creep);
//     if (spawn) {
//       return spawn.id;
//     }

//     // let outboundContainer = this.loadOutboundContainer(creep);
//     // if (outBoundContainer) {
//     //   return outBoundContainer.id;
//     // }

//     let storage = this.loadStorage(creep);
//     if (storage) {
//       return storage.id;
//     }

//     // let terminal = this.loadTerminal(creep);
//     // if (terminal) {
//     //   return terminal.id;
//     // }
//   }

//   private deliverMinerals(creep: Creep) {
//     let targetId = creep.memory.targetId;
//     let target = <Structure> Game.getObjectById(targetId);
//     if (!target) {
//       creep.memory.targetId = targetId = this.determineMineralDeliveryTarget(creep);
//       target = <Structure> Game.getObjectById(targetId);
//     }
//     if (!target) {
//       return;
//     }

//     if (this.tryResourceDropOff(creep, target) === ERR_NOT_IN_RANGE) {
//       this.moveTo(creep, target);
//     }
//   }

//   private determineMineralDeliveryTarget(creep: Creep) {
//     // let terminal = this.loadTerminal(creep);
//     // if (terminal) {
//     //   return terminal.id;
//     // }

//     // let labOperandA = this.loadLabOperandA(creep);
//     // if (labOperandA) {
//     //   return labOperandA.id;
//     // }

//     // let labOperandB = this.loadLabOperandB(creep);
//     // if (labOperandB) {
//     //   return labOperandB.id;
//     // }

//     let storage = this.loadStorage(creep);
//     if (storage) {
//       return storage.id;
//     }
//   }

//   private deliver(creep: Creep) {
//     if (this.CarriedMinerals > 0) {
//       this.deliverMinerals(creep);
//       // TODO: deliver minerals.
//       return;
//     }

//     if (this.CarriedEnergy > 0) {
//       this.deliverEnergy(creep);
//       return;
//     }
//   }

//   private refuel(creep: Creep) {
//     let targetId = creep.memory.targetId;
//     let target = Game.getObjectById(targetId);
//     if (!target) {
//       // TODO: Need to handle dropped resource differently from container.
//       creep.memory.targetId = targetId = this.determineEnergyRefuelTarget(creep);
//       target = Game.getObjectById(targetId);
//     }
//     if (!target) {
//       // TODO: Code goes here.
//       // let x = 1 / 0; // TODO: force error so it's impossible to deploy to production.
//       throw new Error("Not implemented.");
//     }
//   }

//   private determineEnergyRefuelTarget(creep: Creep) {
//     let sourceId = creep.memory.sourceId;
//     let source = <Source> Game.getObjectById(sourceId);
//     if (!source) {
//       // TODO: Figure out what to do here.
//       return;
//     }

//     let containers = creep.room.find<Container>(FIND_STRUCTURES, {
//       filter: (c: Container) => c.structureType === STRUCTURE_CONTAINER
//       && (c.store[RESOURCE_ENERGY] || 0) > 0
//       && c.pos.isNearTo(source),
//     });
//     if (containers.length) {
//       return containers[0].id;
//     }

//     // let memMinerPosition = creep.room.memory.sources[sourceId].minerPosition;
//     let droppedEnergies = creep.room.find<Resource>(FIND_DROPPED_RESOURCES, {
//       filter: (d: Resource) =>d.resourceType === RESOURCE_ENERGY
//       && d.pos.isNearTo(source),
//     });
//     if (droppedEnergies.length > 0) {
//       return droppedEnergies[0].id;
//     }
//   }

//   public run() {
//     super.run();

//     let state = this.creep.memory.state;

//     if (state === C.STATE_TRAVELING) {
//       return;
//     }

//     this.creep.memory.state = state = this.determineState();

//     if (state === C.STATE_DELIVERING) {
//       this.deliver(this.creep);
//       return;
//     }

//     if (state === C.STATE_REFUELING) {
//       this.refuel(this.creep);
//       return;
//     }

//     log.error("Un-handled hauler state: " + state);

//     // let storage = this.loadStorage(this.creep);
//     // if (storage) {
//     //   // Deposit non-energy resources into storage.
//     //   if (this.isFull(this.creep) && this.carryingNonEnergyResource(this.creep)) {
//     //     this.tryResourceDropOff(this.creep, storage);
//     //     return;
//     //   }

//     //   // Look for dropped resources.
//     //   let droppedResource = this.loadDroppedResource(this.creep, 100, this.roomHandler);
//     //   if (droppedResource !== undefined) {
//     //     this.moveToPickup(this.creep, droppedResource);
//     //     return;
//     //   } else {
//     //     // Deposit non-energy resources into storage.
//     //     if (this.carryingNonEnergyResource(this.creep)) {
//     //       this.tryResourceDropOff(this.creep, storage);
//     //       return;
//     //     }
//     //   }
//     // }

//     // // Default state to refueling.
//     // if (this.creep.memory.state === undefined) {
//     //   this.creep.memory.state = C.STATE_REFUELING;
//     // }

//     // if (this.creep.memory.state === C.STATE_REFUELING) {
//     //   this.runRefueling(this.creep, this.roomHandler);
//     //   if (this.doesCreepHaveEnergy(this.creep)) {
//     //     this.creep.memory.state = C.STATE_DELIVERING;
//     //   }
//     //   return;
//     // }

//     // if (this.creep.memory.state === C.STATE_DELIVERING) {
//     //   this.runDelivering(this.creep);
//     //   if (this.isEmpty(this.creep)) {
//     //     this.creep.memory.state = C.STATE_REFUELING;
//     //   }
//     //   return;
//     // }

//     // log.error(this.creep.name + " Unknown creep state: " + this.creep.memory.state);

//     // // // Default to refueling state.
//     // // let energyCarried = this.creep.carry[RESOURCE_ENERGY] || 0;
//     // // if (this.creep.memory.state === undefined || energyCarried === 0) {
//     // //   this.creep.memory.state = C.STATE_REFUELING;
//     // // } else if (energyCarried > 0) {
//     // //   this.creep.memory.state = C.STATE_DELIVERING;
//     // // }

//     // // switch (this.creep.memory.state) {
//     // //   case C.STATE_REFUELING: this.runRefueling(this.creep, this.roomHandler); return;
//     // //   case C.STATE_DELIVERING: this.runDelivering(this.creep); return;
//     // //   default: log.error("Unknown creep state: " + this.creep.memory.state);
//     // // }
//   }

//   public runRefueling(creep: Creep, roomHandler: RoomHandler) {
//     // Move to refuel position.
//     if (this.creep.memory.finalDestination === undefined) {
//       let sourceId = creep.memory.sourceId;
//       let memMinerPosition = roomHandler.room.memory.sources[sourceId].minerPosition;
//       if (memMinerPosition === undefined) { return; }

//       let minerPosition = roomHandler.room.getPositionAt(memMinerPosition.x, memMinerPosition.y);
//       if (minerPosition === null) { return; }

//       this.setFinalDestinationToRefuel(creep, minerPosition, roomHandler);
//       return;
//     }

//     let cargoSpaceAvailable = creep.carryCapacity - _.sum(creep.carry);

//     // Withdraw energy from container if it is full.
//     let container = this.loadContainerNextToCreep(creep, roomHandler);
//     if (container && this.isContainerFullOfEnergy(container)) {
//       // TODO: Combine this code with doesContainerHaveEnergy
//       let energyAvailable = container.store[RESOURCE_ENERGY] || 0;
//       let energyToWithdraw = _.min({cargoSpaceAvailable, energyAvailable});
//       if (energyToWithdraw > 0) {
//         creep.withdraw(container, RESOURCE_ENERGY, energyToWithdraw);
//         return;
//       }
//     }

//     // Pickup overflow energy.
//     let droppedEnergy = this.loadDroppedEnergy(creep, roomHandler, 1);
//     if (droppedEnergy) {
//       creep.pickup(droppedEnergy);
//       return;
//     }

//     // Nothing overflowing. Withdraw energy from container.
//     if (container && this.doesContainerHaveEnergy(container)) {
//       // TODO: Combine this code with isContainerFullOfEnergy
//       let energyAvailable = container.store[RESOURCE_ENERGY] || 0;
//       let energyToWithdraw = _.min({cargoSpaceAvailable, energyAvailable});
//       if (energyToWithdraw > 0) {
//         creep.withdraw(container, RESOURCE_ENERGY, energyToWithdraw);
//         return;
//       }
//     }
//   }

//   public runDelivering(creep: Creep) {
//     // // Drop off non-energy cargo.
//     // let carriedEnergy = creep.carry[RESOURCE_ENERGY] || 0;
//     // let totalCarried = _.sum(creep.carry);
//     // if (carriedEnergy < totalCarried) {
//     //   let storage = this.loadStorage(creep);
//     //   if (storage) {
//     //     if (this.tryResourceDropOff(creep, storage) === ERR_NOT_IN_RANGE) {
//     //       this.moveTo(creep, storage);
//     //     }
//     //     return;
//     //   }
//     // }

//     // Load closest extension.
//     let extension = this.loadExtension(creep);
//     if (extension) {
//       this.creep.memory.finalDestination = undefined; // TODO: Figure out move vs work logic
//       if (this.tryEnergyDropOff(creep, extension) === ERR_NOT_IN_RANGE) {
//         this.moveTo(creep, extension);
//       }
//       return;
//     }

//     // Load closest spawn.
//     let spawn = this.loadSpawn(creep);
//     if (spawn) {
//       this.creep.memory.finalDestination = undefined; // TODO: Figure out move vs work logic
//       if (this.tryEnergyDropOff(creep, spawn) === ERR_NOT_IN_RANGE) {
//         this.moveTo(creep, spawn);
//       }
//       return;
//     }

//     // Load closest tower.
//     let tower = this.loadTower(creep);
//     if (tower) {
//       this.creep.memory.finalDestination = undefined; // TODO: Figure out move vs work logic
//       if (this.tryEnergyDropOff(creep, tower) === ERR_NOT_IN_RANGE) {
//         this.moveTo(creep, tower);
//       }
//       return;
//     }

//     // Load closest outbound container.
//     // TODO: Code goes here.

//     // Load storage.
//     let storage = this.loadStorage(creep);
//     if (storage) {
//       this.creep.memory.finalDestination = undefined; // TODO: Figure out move vs work logic
//       // TODO: Check near squares for creeps that need energy

//       let result = this.tryEnergyDropOff(creep, storage);
//       if (result === ERR_NOT_IN_RANGE) {
//         this.moveTo(creep, storage);
//       }
//       return;
//     }
//   }

//   private loadContainerNextToCreep(creep: Creep, roomHandler: RoomHandler) {
//     let containers = roomHandler.room.find<Container>(FIND_STRUCTURES, {
//       filter: (c: Container) => c.structureType === STRUCTURE_CONTAINER
//       && c.pos.isNearTo(creep),
//     });
//     if (containers.length > 0) {
//       // creep.memory.containerId = containers[0].id;
//       // return containers[0].id;
//       return containers[0];
//     }
//     // TODO: Delete all but one container instead of ignoring them.

//     return undefined;
//   }

//   // TODO: Need to create construction site because the hauler may stop too far away.
//   private loadDroppedEnergy(creep: Creep, roomHandler: RoomHandler, range: number) {
//     let droppedResources = roomHandler.room.find<Resource>(FIND_DROPPED_ENERGY, {
//       filter: (r: Resource) => r.pos.inRangeTo(creep.pos, range),
//     });
//     if (droppedResources.length > 0) {
//       return droppedResources[0];
//     }

//     return undefined;
//   }

//   // private loadDroppedResource(creep: Creep, range: number, roomHandler: RoomHandler) {
//   //   let droppedResources = roomHandler.room.find<Resource>(FIND_DROPPED_RESOURCES, {
//   //     filter: (r: Resource) => r.resourceType !== RESOURCE_ENERGY && r.pos.inRangeTo(creep, range),
//   //   });
//   //   if (droppedResources.length > 0) {
//   //     return droppedResources[0];
//   //   }

//   //   return undefined;
//   // }

//   private loadExtension(creep: Creep) {
//     return creep.pos.findClosestByPath<Extension>(FIND_STRUCTURES, {
//       filter: (e: Extension) => e.structureType === STRUCTURE_EXTENSION
//         && e.isActive // In case the RCL drops and deactivates this structure.
//         && e.energy < e.energyCapacity,
//     });
//   }

//   private loadSpawn(creep: Creep) {
//     return creep.pos.findClosestByPath<Spawn>(FIND_MY_SPAWNS, {
//       filter: (s: Spawn) => s.energy < s.energyCapacity,
//     });
//   }

//   private loadStorage(creep: Creep) {
//     let storages = creep.room.find<Storage>(FIND_MY_STRUCTURES, {
//       filter: (s: Storage) => s.structureType === STRUCTURE_STORAGE
//       && (s.store[RESOURCE_ENERGY] || 0) < _.sum(s.store),
//     });
//     if (storages.length > 0) {
//       return storages[0];
//     }

//     return undefined;
//     // return creep.pos.findClosestByPath<Storage>(FIND_STRUCTURES, {
//     //   filter: (s: Storage) => s.structureType === STRUCTURE_STORAGE
//     //     && s.isActive // In case the RCL drops and deactivates this structure.
//     //     && s.store[RESOURCE_ENERGY] || 0 < _.sum(s.store),
//     // });
//   }

//   private loadTower(creep: Creep) {
//     return creep.pos.findClosestByPath<Tower>(FIND_STRUCTURES, {
//       filter: (t: Tower) => t.structureType === STRUCTURE_TOWER
//         && t.isActive // In case the RCL drops and deactivates this structure.
//         && t.energy < t.energyCapacity,
//     });
//   }

//   // private getFinalDestinationFromRefuelPosition(
//   //   currentPosition: RoomPosition,
//   //   refuelPosition: RoomPosition) {
//   //   let oldX = currentPosition.x;
//   //   let oldY = currentPosition.y;
//   //   let oldRoomName = currentPosition.roomName;
//   //   let oldPosition = new RoomPosition(oldX, oldY, oldRoomName);

//   //   let newX = refuelPosition.x;
//   //   let newY = refuelPosition.y;
//   //   let newRoomName = refuelPosition.roomName;
//   //   let newPosition = new RoomPosition(newX, newY, newRoomName);

//   //   if (oldPosition.inRangeTo(newPosition, 1)) {
//   //     return oldPosition;
//   //   }

//   //   let path = oldPosition.findPathTo(newPosition);
//   //   let step = path[path.length - 1];
//   //   let actualPosition = new RoomPosition(step.x, step.y, newRoomName);
//   //   return actualPosition;
//   // }

//   // private isEmpty(creep: Creep) {
//   //   let energyCarried = creep.carry[RESOURCE_ENERGY] || 0;
//   //   if (energyCarried === 0) {
//   //     return true;
//   //   }
//   //   return false;
//   // }

//   // private isCreepFullOfEnergy(creep: Creep) {
//   //   let carriedEnergy = creep.carry[RESOURCE_ENERGY] || 0;
//   //   if (carriedEnergy === creep.carryCapacity) {
//   //     return true;
//   //   }
//   //   return false;
//   // }

//   private isContainerFullOfEnergy(container: Container) {
//     let storedEnergy = container.store[RESOURCE_ENERGY] || 0;
//     if (storedEnergy === container.storeCapacity) {
//       return true;
//     }
//     return false;
//   }

//   // private doesCreepHaveEnergy(creep: Creep) {
//   //   let carriedEnergy = creep.carry[RESOURCE_ENERGY] || 0;
//   //   if (carriedEnergy > 0) {
//   //     return true;
//   //   }
//   //   return false;
//   // }

//   private doesContainerHaveEnergy(container: Container) {
//     let storedEnergy = container.store[RESOURCE_ENERGY] || 0;
//     if (storedEnergy > 0) {
//       return true;
//     }
//     return false;
//   }

//   private setFinalDestinationToRefuel(creep: Creep, minerPosition: RoomPosition, roomHandler: RoomHandler) {
//     let path = creep.pos.findPathTo(minerPosition);
//     let step: PathStep;
//     let finalDestination: RoomPosition | null;
//     if (path.length > 1) {
//       step = path[path.length - 2];
//       finalDestination = roomHandler.room.getPositionAt(step.x, step.y);
//     } else {
//       finalDestination = creep.pos;
//     }
//     if (finalDestination === null) { return; }
//     this.creep.memory.finalDestination = {};
//     this.creep.memory.finalDestination.x = finalDestination.x;
//     this.creep.memory.finalDestination.y = finalDestination.y;
//     this.creep.memory.finalDestination.roomName = finalDestination.roomName = creep.pos.roomName;
//   }
// }
