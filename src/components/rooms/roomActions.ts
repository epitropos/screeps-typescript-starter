export function loadExtensions(room: Room): Extension[] {
  return room.find<Extension>(FIND_STRUCTURES, {
    filter: (s: Extension) => s.structureType === STRUCTURE_EXTENSION && s.energy < s.energyCapacity,
  });
}

export function loadContainers(room: Room): Container[] {
  return room.find<Container>(FIND_STRUCTURES, {
    filter: (s: Container) => s.structureType === STRUCTURE_CONTAINER && _.sum(s.store) < s.storeCapacity,
  });
}

export function loadTowers(room: Room): Tower[] {
  return room.find<Tower>(FIND_STRUCTURES, {
    filter: (s: Tower) => s.structureType === STRUCTURE_TOWER && s.energy < s.energyCapacity,
  });
}

export function loadConstructionSites(room: Room): ConstructionSite[] {
  return room.find<ConstructionSite>(FIND_CONSTRUCTION_SITES);
}

export function loadDamagedStructures(room: Room): Structure[] {
  return room.find<Structure>(FIND_STRUCTURES, {filter: (s: Structure) => s.hits < s.hitsMax});
}