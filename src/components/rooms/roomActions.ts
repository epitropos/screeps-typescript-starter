// export function controllerNeedsUpgrading(room: Room): boolean {
//   if (room.controller) {
//     return room.controller.level < 8;
//   }

//   return false;
// }

// export function constructionSitesExist(room: Room): boolean {
//   let constructionSites = room.find(FIND_MY_CONSTRUCTION_SITES);
//   return constructionSites.length > 0;
// }

// export function loadExtensions(room: Room): Extension[] {
//   return room.find<Extension>(FIND_STRUCTURES, {
//     filter: (s: Extension) => s.structureType === STRUCTURE_EXTENSION && s.energy < s.energyCapacity,
//   });
// }

// export function loadContainers(room: Room): Container[] {
//   return room.find<Container>(FIND_STRUCTURES, {
//     filter: (s: Container) => s.structureType === STRUCTURE_CONTAINER,
//   });
// }

// export function loadContainersWithEnergy(room: Room): Container[] {
//   return room.find<Container>(FIND_STRUCTURES, {
//     filter: (c: Container) => c.structureType === STRUCTURE_CONTAINER && c.store[RESOURCE_ENERGY] > 0,
//   });
// }

// export function loadContainersWithSpace(room: Room): Container[] {
//   return room.find<Container>(FIND_STRUCTURES, {
//     filter: (s: Container) => s.structureType === STRUCTURE_CONTAINER && _.sum(s.store) < s.storeCapacity,
//   });
// }

// export function loadTowers(room: Room): Tower[] {
//   return room.find<Tower>(FIND_STRUCTURES, {
//     filter: (s: Tower) => s.structureType === STRUCTURE_TOWER && s.energy < s.energyCapacity,
//   });
// }

// export function loadConstructionSites(room: Room): ConstructionSite[] {
//   return room.find<ConstructionSite>(FIND_CONSTRUCTION_SITES);
// }

// export function loadDamagedStructures(room: Room): Structure[] {
//   return room.find<Structure>(FIND_STRUCTURES,
//   {filter: (s: Structure) => (s.structureType !== STRUCTURE_WALL && s.hits < s.hitsMax)
//     || (s.structureType === STRUCTURE_WALL && s.hits < 100000)});
// }
