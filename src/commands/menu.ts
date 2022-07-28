import parser from "node-html-parser";
import { SlashCommandBuilder } from "@discordjs/builders";
import axios from "axios";
import { CommandInteraction, MessageEmbed } from "discord.js";
import config from "../config";
import { IBotCommand } from "../types";
import { stdout } from "process";

export const command: IBotCommand = {
  data: new SlashCommandBuilder()
    .setName("menu")
    .setDescription("🍽️ What's on the menu today?"),
  async execute(interaction: CommandInteraction<"cached">) {
    const url = "https://mayk.fi/tietoa-meista/ruokailu/";

    const menuEmbed = new MessageEmbed().setTimestamp();

    axios.get(url).then((res) => {
      const regex = /<p class="ruoka-header-(ruoka|kasvisruoka)">([^<]*)</g;

      const str = res.data;
      let m;

      let menu: string[] = [];

      while ((m = regex.exec(str)) !== null) {
        if (m.index === regex.lastIndex) {
          regex.lastIndex++;
        }

        m.forEach((match, groupIndex) => {
          if (groupIndex != 0 && groupIndex != 1) {
            menu.push(match);
          }
        });
      }

      if (menu.length == 0) {
        menuEmbed
          .setColor(config.colors.error)
          .setDescription("😔 No food this week.");
        interaction.reply({ embeds: [menuEmbed], ephemeral: true });
        return;
      }

      const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
      const today = days[new Date().getDay() - 1];

      let date = [];
      let norm = [];
      let vege = [];

      for (let i = 0; i < menu.length; i++) {
        let day = days[i / 2];

        if (i % 2 == 0) {
          if (day == today) {
            date.push(`✨ **${day}**`);
          } else {
            date.push(day);
          }

          norm.push(menu[i]);
        } else {
          vege.push(menu[i]);
        }
      }

      for (let i = 0; i < 5; i++) {
        menuEmbed.addField(
          `${date[i]}`,
          `${`🍴 ${norm[i]}\n🌱 ${vege[i]}`}`,
          false
        );
      }

      menuEmbed
        .setTitle("🍽️ Menu")
        .setColor(config.colors.success)
        .setDescription(`[Current menu in mayk.fi](${url})`);
      interaction.reply({ embeds: [menuEmbed] });
    });
  },
};
