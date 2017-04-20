export function needsEnergy(structure: Tower): boolean {
  return structure.energy < structure.energyCapacity;
}

export function isDamaged(structure: Structure): boolean {
  return structure.hits < structure.hitsMax;
}
