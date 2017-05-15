export const CARRIER = "C";
export const BUILDER = "B️";
export const EXTRACTOR = "e";
// export const HARVESTER = "H️";
export const HAULER = "h";
export const MINER = "M";
export const STOCKER = "S";
export const UPGRADER = "U️";
export const SCOUT = "MS";

export const BRIGHTRED = "#ff6666";
export const RED = "#ff0000";
export const YELLOW = "#ffff00";
export const WHITE = "#ffffff";

export function Error(errorCode: number) {
  switch (errorCode) {
    case OK: return "OK";
    case ERR_BUSY: return "ERR_BUSY";
    case ERR_FULL: return "ERR_FULL";
    case ERR_GCL_NOT_ENOUGH: return "ERR_GCL_NOT_ENOUGH";
    case ERR_INVALID_ARGS: return "ERR_INVALID_ARGS";
    case ERR_INVALID_TARGET: return "ERR_INVALID_TARGET";
    case ERR_NAME_EXISTS: return "ERR_NAME_EXISTS";
    case ERR_NO_BODYPART: return "ERR_NO_BODYPART";
    case ERR_NO_PATH: return "ERR_NO_PATH";
    case ERR_NOT_ENOUGH_ENERGY: return "ERR_NOT_ENOUGH_ENERGY";
    case ERR_NOT_ENOUGH_EXTENSIONS: return "ERR_NOT_ENOUGH_EXTENSIONS";
    case ERR_NOT_ENOUGH_RESOURCES: return "ERR_NOT_ENOUGH_RESOURCES";
    case ERR_NOT_FOUND: return "ERR_NOT_FOUND";
    default: return "UNKNOWN_ERROR";
  }
}
