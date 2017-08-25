export class MessageHandler {
  public static InitializeMemory() {
    if (!Memory.messages) { Memory.messages = {}; }
    // if (!Memory.messages.cloneCreep) { Memory.messages.cloneCreep = {}; }
    // if (!Memory.messages.nextMessageId) { Memory.messages.nextMessageId = 1; }
  }

  constructor () {
    // No operation.
  }
}
