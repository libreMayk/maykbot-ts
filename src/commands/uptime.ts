import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { IBotCommand } from "../types";
import millisecondsToString from "pretty-print-ms";
import config from "../config";

export const command: IBotCommand = {
  data: new SlashCommandBuilder()
    .setName("uptime")
    .setDescription("⏳ Displays the bot's uptime"),
  async execute(interaction) {
    const uptimeEmbed = new MessageEmbed()
      .setTitle("⏳ Uptime")
      .setDescription(
        interaction.client.uptime != null
          ? `The bot has been up for \`${millisecondsToString(
              interaction.client.uptime
            )}\``
          : `¯\\_(ツ)_/¯`
      )
      .setTimestamp()
      .setColor(config.colors.primary);

    interaction.reply({
      embeds: [uptimeEmbed],
      ephemeral: true,
    });
  },
};
