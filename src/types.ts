import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "@discordjs/builders";
import {
  ClientEvents,
  CommandInteraction,
  PermissionResolvable,
} from "discord.js";
import { Bot } from "./structures/Bot";

export interface IBotCommand {
  data:
    | SlashCommandBuilder
    | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
    | SlashCommandSubcommandsOnlyBuilder;
  requiredPerms?: PermissionResolvable;
  execute: (interaction: CommandInteraction<"cached">, client: Bot) => unknown;
}

export type EventName = keyof ClientEvents;

export type EventListener<T extends EventName> = (
  _client: Bot,
  ...args: ClientEvents[T]
) => void;

export interface IBotEvent<T extends EventName> {
  eventName: T;
  on?: EventListener<T>;
  once?: EventListener<T>;
}

export const TypedEvent = <T extends EventName>(event: IBotEvent<T>) => event;
