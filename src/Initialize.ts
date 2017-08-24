import {MessageHandler} from "./components/messages/MessageHandler";

export class Initialize {
  public static InitializeMemory() {
    this.InitializeMemoryConfig(); // TODO: Move this into the appropriate location.
    this.InitializeMemoryConfigDefaults(); // TODO: Move this into the appropriate location.
    this.InitializeMemoryConfigDefaultsPopulation(); // TODO: Move this into the appropriate location.
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

  private static InitializeMemoryConfigDefaultsPopulation() {
    if (!Memory.config.defaults.population) {
      Memory.config.defaults.population = {};
      Memory.config.defaults.population.maximums = {};
      Memory.config.defaults.population.maximums.builders = 1;
      Memory.config.defaults.population.maximums.haulers = 0;
      Memory.config.defaults.population.maximums.miners = 0;
      Memory.config.defaults.population.maximums.upgraders = 1;
    }
  }
}
