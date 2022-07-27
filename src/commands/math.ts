import { code } from "./../utils";
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { evaluate } from "mathjs";
import { IBotCommand } from "../types";
import config from "../config";

export const command: IBotCommand = {
  data: new SlashCommandBuilder()
    .setName("math")
    .setDescription("Calculates the input.")
    .addStringOption((option) =>
      option
        .setName("calculation")
        .setDescription("🧮 Calculation to evaluate.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const calc = interaction.options.getString("calculation", true);

    try {
      const result = evaluate(calc);
      const successEmbed = new MessageEmbed()
        .setColor(config.colors.success)
        .setAuthor({
          name: interaction.user.tag,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setFields([
          {
            name: "Input",
            value: code(calc),
          },
          {
            name: "Result",
            value: code(result),
          },
        ]);
      interaction.reply({ embeds: [successEmbed], ephemeral: true });
    } catch (err) {
      const errorEmbed = new MessageEmbed()
        .setColor(config.colors.error)
        .setAuthor({
          name: interaction.user.tag,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setFields([
          {
            name: "Input",
            value: code(calc),
          },
          {
            name: "Error",
            value: code(err as string),
          },
        ]);
      interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  },
};
