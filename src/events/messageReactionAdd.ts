import {
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  User,
} from "discord.js";
import { TypedEvent } from "../types";

export default TypedEvent({
  eventName: "messageReactionAdd",
  on: async (
    _,
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser
  ) => {
    const member = reaction.message.guild?.members.cache.get(user.id);
    if (!member) return;
  },
});
