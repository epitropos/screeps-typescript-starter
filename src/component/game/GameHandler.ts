// import * as Config from "../../config/config";
import { log } from "../../lib/logger/log";

export class GameHandler {
  public readonly game: Game;

  private debug: boolean = false;

  constructor (game: Game) {
    this.game = game;
  }

  public run() {
    if (this.debug) {
      log.info("CHEETO - GameHandler.run");
    }

    // TODO: Code goes here.
  }
}
