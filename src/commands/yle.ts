import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { IBotCommand } from "../types";
import axios from "axios";
import { toJson } from "xml2json";
import { parse } from "node-html-parser";

export const command: IBotCommand = {
  data: new SlashCommandBuilder()
    .setName("yle")
    .setDescription("📰 Check what's on the today, yle.fi"),
  async execute(interaction) {
    const url =
      "https://feeds.yle.fi/uutiset/v1/majorHeadlines/YLE_UUTISET.rss";
    const yleEmbed = new MessageEmbed().setTimestamp();

    const feed = await axios.get(url);
    const json = JSON.parse(toJson(feed.data)).rss.channel;

    const item = json.item[1];

    const categories = () => {
      let catArray: string[] = [];

      item.category.map((cat: string) => {
        const category = cat.charAt(0).toUpperCase() + cat.slice(1);

        catArray.push(category);
      });

      if (catArray.length >= 3) {
        return catArray
          .slice(0, 3)
          .map((item) => {
            return item;
          })
          .join(", ");
      } else {
        return catArray[0];
      }
    };

    yleEmbed
      .setTitle(`${item.title}`)
      .setColor(0x00b4c9)
      .setAuthor({
        name: "Yle Uutiset",
        iconURL:
          "https://images.cdn.yle.fi/image/upload/f_auto,fl_progressive/q_auto/w_2300,h_2300,c_crop,x_890,y_845/w_2890/w_2890,h_2890,c_fit/v1641897373/39-90051461dd5d3129248.jpg",
        url: json.link,
      })
      .setFooter({
        text: `${categories()}`,
      })
      .setTimestamp(item.pubDate)
      .setURL(item.link.replace(/\?origin=rss/g, ""))
      .setDescription(
        `${item.description}\n---\n[Learn more...](${item.link.replace(
          /\?origin=rss/g,
          ""
        )})`
      );

    if (item.enclosure && item.enclosure.url) {
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
