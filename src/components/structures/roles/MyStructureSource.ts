// import * as Config from "../../../config/config";
// import {log} from "../../../lib/logger/log";
import {MyStructureBase} from "./MyStructureBase";
import {RoomHandler} from "../../rooms/RoomHandler";

export class MyStructureSource extends MyStructureBase {
  constructor(roomHandler: RoomHandler) {
    super(roomHandler);
  }
}
