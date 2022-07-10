import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { IBotCommand } from "../types";
import config from "../config";

export const command: IBotCommand = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Delete specified amount of messages.")
    .addNumberOption((option) =>
      option
        .setName("amount")
        .setDescription("Amount of messages to delete")
        .setRequired(true)
    ),
  requiredPerms: ["MANAGE_MESSAGES"],
  async execute(interaction) {
    const deleted = await interaction.channel!.bulkDelete(
      interaction.options.getNumber("amount", true),
      true
    );

    const successEmbed = new MessageEmbed()
      .setColor(config.colors.success)
      .setDescription(`Deleted \`${deleted.size}\` messages.`);
    await interaction.reply({ embeds: [successEmbed], ephemeral: true });
  },
};
