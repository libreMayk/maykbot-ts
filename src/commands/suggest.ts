import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed, TextChannel } from "discord.js";
import config from "../config";
import { IBotCommand } from "../types";

export const command: IBotCommand = {
  data: new SlashCommandBuilder()
    .setName("suggest")
    .setDescription("🖋️ Write a new suggestion for the channel.")
    .addStringOption((option) =>
      option
        .setName("title")
        .setDescription("Suggestion's title.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("Set suggestion's description.")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const suggestionsChannel = client.channels.cache.get(
      config.suggestionsChannelId
    ) as TextChannel;

    const suggestionEmbed = new MessageEmbed()
      .setColor(config.colors.primary)
      .setAuthor({
        name: interaction.user.tag,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTitle(`🖋️ ${interaction.options.getString("title")}`)
      .setDescription(interaction.options.getString("description", true))
      .setTimestamp();

    const message = await suggestionsChannel.send({
      embeds: [suggestionEmbed],
    });
    await message.react("👍");
    message.react("👎");

    const successMessageEmbed = new MessageEmbed()
      .setColor(config.colors.success)
      .setDescription(
        `🖋️ Suggestion successfully created at <#${config.suggestionsChannelId}>`
      );

    interaction.reply({ embeds: [successMessageEmbed], ephemeral: true });
  },
};
