class CreepMiner extends CreepSupport {

}

// This will require carriers (or haulers) that pick up dropped energy, or containers directly below miners.
// Calculation of body parts.
// 1 part = move (+50)
// add work (+100) parts up to 5 (+500) or room.energyCapacityAvailable is reached
// i.e. for 300 room energy WORK, WORK, MOVE
// i.e. for 400 room energy WORK, WORK, WORK, MOVE
// i.e. for 500 room energy WORK, WORK, WORK, WORK, MOVE
// i.e. for >=600 room energy WORK, WORK, WORK, WORK, WORK, MOVE
