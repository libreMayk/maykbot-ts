import { SlashCommandBuilder } from "@discordjs/builders";
import axios from "axios";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { IBotCommand } from "../types";

interface CovidData {
  dataset: {
    label: string;
    value: {
      [x: string]: any;
    };
  };
}

export const command: IBotCommand = {
  data: new SlashCommandBuilder()
    .setName("covid")
    .setDescription("🦠 Provides COVID-19 data from the THL website."),
  async execute(interaction: CommandInteraction<"cached">) {
    const url =
      "https://sampo.thl.fi/pivot/prod/en/epirapo/covid19case/fact_epirapo_covid19case.json?row=dateweek20200101-509030&row=hcdmunicipality2020-445171&column=measure-444833.445356.492118.&fo=1";

    await axios.get(url).then((res) => {
      const json: CovidData = res.data;

      const cases = Object.values(json.dataset.value);

      const covidCase = (num: number) => {
        return cases[cases.length - num];
      };

      const data = {
        name: "thl.fi",
        iconURL:
          "https://thl.fi/o/thl-liferay-theme/images/thl_common/thl-logo.png",
        url: "https://thl.fi/fi/web/infektiotaudit-ja-rokotukset/ajankohtaista/ajankohtaista-koronaviruksesta-covid-19/",
      };

      const covidEmbed = new MessageEmbed()
        .setTitle("🦠 COVID-19 Info")
        .setColor(0x7bc143)
        .setAuthor({
          name: data.name,
          iconURL: data.iconURL,
          url: data.url,
        })
        .setURL(`https://${data.name}/en/web/thlfi-en`)
        .setDescription(
          "Do you think you have the coronavirus infection?\nStart the check-up at [omaolo.fi](https://omaolo.fi/en)"
        )
        .addFields({
          name: "Cases in _Helsinki_",
          value: `>>> **${covidCase(1)}** total cases\n**${covidCase(
            2
          )}** cases over the last week`,
          inline: true,
        })
        .setTimestamp();

      interaction.reply({
        embeds: [covidEmbed],
      });
    });
  },
};
