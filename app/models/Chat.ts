import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * Model description here for TypeScript hints.
 */
export const ChatModel = types
  .model("Chat")
  .props({})
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface Chat extends Instance<typeof ChatModel> {}
export interface ChatSnapshotOut extends SnapshotOut<typeof ChatModel> {}
export interface ChatSnapshotIn extends SnapshotIn<typeof ChatModel> {}
export const createChatDefaultModel = () => types.optional(ChatModel, {})
