import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import config from "../config";
import { IBotCommand } from "../types";
import axios from "axios";
import { toJson } from "xml2json";
import { parse } from "node-html-parser";

export const command: IBotCommand = {
  data: new SlashCommandBuilder()
    .setName("yle")
    .setDescription("🍴 What's on the menu today?"),
  async execute(interaction) {
    const url =
      "https://feeds.yle.fi/uutiset/v1/majorHeadlines/YLE_UUTISET.rss";
    const yleEmbed = new MessageEmbed().setTimestamp();

    const feed = await axios.get(url);
    const json = JSON.parse(toJson(feed.data)).rss.channel;

    const item = json.item[2];

    yleEmbed
      .setTitle(`${item.title}`)
      .setColor(0x00b4c9)
      .setAuthor({
        name: json.title,
        iconURL:
          "https://images.cdn.yle.fi/image/upload/f_auto,fl_progressive/q_auto/w_2300,h_2300,c_crop,x_890,y_845/w_2890/w_2890,h_2890,c_fit/v1641897373/39-90051461dd5d3129248.jpg",
        url: json.link,
      })
      .setFooter({
        text: `${
          item.category[0].charAt(0).toUpperCase() + item.category[0].slice(1)
        }`,
      })
      .setTimestamp(item.pubDate)
      .setURL(item.link.replace(/\?origin=rss/g, ""))
      .setDescription(
        `${item.description}\n[Learn more...](${item.link.replace(
          /\?origin=rss/g,
          ""
        )})`
      );

    if (item.enclosure.url) {
      yleEmbed.setImage(
        item.enclosure.url.replace(/\/\/w_[[0-9]+,h_[[0-9]+,q_[[0-9]+/g, "")
      );
    } else {
      const image = await axios.get(item.link);
      const root = parse(image.data);

      const imageURL = root.querySelectorAll("img");
      const imageArray: string[] = [];

      imageURL.map((elem) => {
        if (
          elem
            .getAttribute("src")
            ?.startsWith("https://images.cdn.yle.fi/image/upload/")
        ) {
          imageArray.push(elem.getAttribute("src") as string);
        }
      });

      if (imageArray.length > 0) {
        yleEmbed.setImage(imageArray[0]);
      }
    }

    interaction.reply({ embeds: [yleEmbed] });
  },
};
