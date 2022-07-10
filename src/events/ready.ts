import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/rest/v9";
import config from "../config";
import { Bot } from "../structures/Bot";
import { IBotCommand, TypedEvent } from "../types";
import { commandFiles } from "../files";

export default TypedEvent({
  eventName: "ready",
  once: async (client: Bot) => {
    client.logger.console.info(`Logged in as ${client.user?.tag}.`);

    const commandArr: object[] = [];

    for await (const file of commandFiles) {
      const command = (await import(file)).command as IBotCommand;
      if (!command) {
        console.error(
          `File at path ${file} seems to incorrectly be exporting a command.`
        );
        continue;
      }

      commandArr.push(command.data.toJSON());
      client.commands.set(command.data.name, command);
      client.logger.console.debug(`Registered command ${command.data.name}`);
    }

    const rest = new REST({ version: "9" }).setToken(config.token!);

    rest.put(Routes.applicationCommands(client.user.id), {
      body: commandArr,
    });
  },
});
