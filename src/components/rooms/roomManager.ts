// class RoomManager {
//   public room: Room;

//   constructor(room: Room) {
//     this.room = room;
//   }

//   /*#######################*/
//   /*# Methods to refactor #*/
//   /*#######################*/

//   public controllerNeedsUpgrading(room: Room): boolean {
//     if (room.controller) {
//       return room.controller.level < 8;
//     }

//     return false;
//   }

//   public constructionSitesExist(room: Room): boolean {
//     let constructionSites = room.find(FIND_MY_CONSTRUCTION_SITES);
//     return constructionSites.length > 0;
//   }

//   public loadExtensions(room: Room): Extension[] {
//     return room.find<Extension>(FIND_STRUCTURES, {
//       filter: (s: Extension) => s.structureType === STRUCTURE_EXTENSION && s.energy < s.energyCapacity,
//     });
//   }

//   public loadContainers(room: Room): Container[] {
//     return room.find<Container>(FIND_STRUCTURES, {
//       filter: (s: Container) => s.structureType === STRUCTURE_CONTAINER,
//     });
//   }

//   public loadContainersWithSpace(room: Room): Container[] {
//     return room.find<Container>(FIND_STRUCTURES, {
//       filter: (s: Container) => s.structureType === STRUCTURE_CONTAINER && _.sum(s.store) < s.storeCapacity,
//     });
//   }

//   public loadTowers(room: Room): Tower[] {
//     return room.find<Tower>(FIND_STRUCTURES, {
//       filter: (s: Tower) => s.structureType === STRUCTURE_TOWER && s.energy < s.energyCapacity,
//     });
//   }

//   public loadConstructionSites(room: Room): ConstructionSite[] {
//     return room.find<ConstructionSite>(FIND_CONSTRUCTION_SITES);
//   }

//   public loadDamagedStructures(room: Room): Structure[] {
//     return room.find<Structure>(FIND_STRUCTURES, {filter: (s: Structure) => s.hits < s.hitsMax});
//   }
// }
