import {MessageHandler} from "./component/message/MessageHandler";

export class Initialize {
  public static InitializeMemory() {
    this.InitializeMemoryConfig(); // TODO: Move this into the appropriate location.
    this.InitializeMemoryConfigDefaults(); // TODO: Move this into the appropriate location.
    // this.InitializeMemoryConfigDefaultsPopulation(); // TODO: Move this into the appropriate location.
    MessageHandler.InitializeMemory(); // TODO: Consider this for the style of the appropriate location.
  }

  private static InitializeMemoryConfig() {
    if (!Memory.config) {
      Memory.config = {};
    }
  }

  private static InitializeMemoryConfigDefaults() {
    if (!Memory.config.defaults) {
      Memory.config.defaults = {};
    }
  }
}
