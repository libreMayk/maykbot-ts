import { SlashCommandBuilder } from "@discordjs/builders";
import axios from "axios";
import parser from "node-html-parser";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { IBotCommand } from "../types";
import config from "../config";

export const command: IBotCommand = {
  data: new SlashCommandBuilder()
    .setName("calendar")
    .setDescription("mayk.fi calendar")
    .addNumberOption((option) =>
      option
        .setName("amount")
        .setDescription("Amount of events to display in the embed.")
        .setMinValue(3)
        .setMaxValue(15)
        .setRequired(false)
    ),
  async execute(interaction: CommandInteraction<"cached">) {
    const args = interaction.options.getNumber("amount");
    const url = "https://www.mayk.fi/kalenteri/";

    axios.get(url).then((res) => {
      const document = parser(res.data);

      const event = document.querySelectorAll("div.summary");
      const time = document.querySelectorAll("abbr.dtstart");

      const eventArray = Array.from(event).map((item) => {
        return item.textContent;
      });
      const timeArray = Array.from(time).map((item) => {
        return item.textContent;
      });

      const eventTimeArray = eventArray.map((item, index) => {
        return {
          event: item,
          time: timeArray[index],
        };
      });

      const amountArgs = () => {
        if (!args) {
          return 5;
        } else {
          return Math.round(args);
        }
      };

      const calEmbed = new MessageEmbed()
        .setColor(config.colors.primary)
        .setURL(url)
        .setTitle("📆 mayk.fi calendar")
        .setDescription(`**${amountArgs()}** events listed`)
        .setFooter({
          text: "mayk.fi",
          iconURL: config.logoURL,
        })
        .setTimestamp();

      for (let i = 0; i < amountArgs(); i++) {
        let dict = {
          time: eventTimeArray[i].time,
          event: eventTimeArray[i].event,
        };

        calEmbed.addField(
          `${dict.time}`,
          `${
            dict.event.startsWith("YO-koe")
              ? `\🔖 ${dict.event}`.replace(/YO-koe\:/g, "**YO-koe:**")
              : dict.event.includes("loma")
              ? `🎉 **${dict.event}**`
              : dict.event.startsWith("Lukuvuosi") &&
                dict.event.includes("alkaa")
              ? `📖 **${dict.event}**`
              : dict.event
          }`,
          false
        );
      }

      interaction.reply({ embeds: [calEmbed] });
    });
  },
};
