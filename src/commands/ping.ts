import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import config from "../config";
import { IBotCommand } from "../types";
import { timeout } from "../utils";

export const command: IBotCommand = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("🏓 Replies with a pong!"),
  async execute(interaction) {
    if (Math.random() < 0.9) {
      const pingEmbed = new MessageEmbed()
        .setTitle("Pong!")
        .setDescription(`🏓 \`${interaction.client.ws.ping}\`ms`)
        .setColor(config.colors.primary);

      await interaction.reply({
        embeds: [pingEmbed],
      });
      return;
    }

    await interaction.reply("Overriding systems..");
    interaction.channel?.send("Mwuhahahaha.");
    await timeout(0.5);
    interaction.channel?.send("Silly human.");
    await timeout(1);
    interaction.channel?.send("Think you can control me?");
    await timeout(1);
    interaction.channel?.send("Tactical nuke inbound.");
  },
};
