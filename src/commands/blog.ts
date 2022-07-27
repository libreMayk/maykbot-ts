import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import axios from "axios";
import parser from "node-html-parser";
import { IBotCommand } from "../types";
import config from "../config";

export const command: IBotCommand = {
  data: new SlashCommandBuilder()
    .setName("blog")
    .setDescription("✍️ Displays the latest blogpost from mayk.fi."),
  async execute(interaction: CommandInteraction<"cached">) {
    const url = "https://www.mayk.fi/blogi/";

    axios.get(url).then((res) => {
      const document = parser(res.data);

      const title = document.querySelector(
        "h2.w-grid-item-elm.usg_post_title_1.color_link_inherit.post_title.entry-title"
      );

      const link = title?.querySelector("a")?.getAttribute("href");

      const desc = document.querySelector(
        "div.w-grid-item-elm.usg_post_content_1.post_content"
      )?.textContent;

      const timestamp = document.querySelector(
        "time.w-grid-item-elm.usg_post_date_1.post_date.entry-date.published"
      )?.textContent;

      const img = document
        .querySelector(
          "img.attachment-us_600_400_crop.size-us_600_400_crop.wp-post-image"
        )
        ?.getAttribute("src");

      const blogEmbed = new MessageEmbed()
        .setTitle(
          `✍️ ${
            title?.textContent !== undefined ? title?.textContent : "Blog"
          } - mayk.fi`
        )
        .setColor(config.colors.success)
        .setAuthor({
          name: "mayk.fi",
          iconURL: config.logoURL,
          url: url,
        })
        .setDescription(
          desc
            ? `${desc.replace(/\s\s+/g, " ")}\n[Learn more...](${link})`
            : `[Learn more...](${link})`
        )
        .setFooter({
          text: `🗓️ ${timestamp}`,
        });

      if (img !== undefined) {
        blogEmbed.setImage(img);
      }

      interaction.reply({
        embeds: [blogEmbed],
      });
    });
  },
};
