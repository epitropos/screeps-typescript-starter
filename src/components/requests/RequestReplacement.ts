// import * as Config from "../../config/config";
// import {log} from "../../lib/logger/log";
import {Request} from "./Request";

export class RequestReplacement extends Request {
  public bodyParts: string[];
  public destinationRoomName: string;
  public destinationPosition: RoomPosition;

  constructor () {
    super();
  }

  public createRequest() {
    let nextRequestId = Memory.requests.nextRequestId;
    Memory.requests.nextRequestId++;
    Memory.requests[nextRequestId] = {};
    Memory.requests[nextRequestId].bodyParts = this.bodyParts;
    Memory.requests[nextRequestId].destinationRoomName = this.destinationRoomName;
    Memory.requests[nextRequestId].destinationPosition = this.destinationPosition;
  }
}
