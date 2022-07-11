import { SlashCommandBuilder } from "@discordjs/builders";
import axios from "axios";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { IBotCommand } from "../types";

const roundToNearest30 = (date = new Date()) => {
  const minutes = 30;
  const ms = 1000 * 60 * minutes;

  // 👇️ replace Math.round with Math.ceil to always round UP
  return new Date(Math.round(date.getTime() / ms) * ms);
};

const getDateEmoji = (num: number) => {
  let timeNow = roundToNearest30(new Date(num * 1000))
    .toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
    })
    .replace(/[^0-9]/g, "");

  if (timeNow.slice(-2) == "00") {
    timeNow = timeNow.slice(0, -2);
  }

  return `:clock${timeNow}:`;
};

export const command: IBotCommand = {
  data: new SlashCommandBuilder()
    .setName("weather")
    .setDescription("Displays current weather in Maunula."),
  async execute(interaction: CommandInteraction<"cached">) {
    try {
      let lat = 60.22984760837544;
      let lon = 24.925459757586037;
      let apiKey = process.env.WEATHER_API_KEY;
      const weatherInfo = async () => {
        const allData = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const json = await allData.data;
        const weatherData = json.weather[0];

        const windDirMoji = () => {
          let windeg = json.wind.deg;
          if (windeg > 22.5 && windeg <= 67.5) {
            return "↗";
          } else if (windeg > 67.5 && windeg <= 112.5) {
            return "➡";
          } else if (windeg > 112.5 && windeg <= 157.5) {
            return "↘";
          } else if (windeg > 157.5 && windeg <= 202.5) {
            return "⬇";
          } else if (windeg > 202.5 && windeg <= 247.5) {
            return "↙";
          } else if (windeg > 247.5 && windeg <= 292.5) {
            return "⬅";
          } else if (windeg > 292.5 && windeg <= 337.5) {
            return "↖";
          } else if (windeg > 337.5 || windeg <= 22.5) {
            return "⬆";
          }
        };

        const weatherIconMoji = () => {
          switch (weatherData.icon) {
            case "01d":
              return ":sunny:";
            case "01n":
              return ":new_moon:";
            case /02n|g/g:
              return ":partly_sunny:";
            case /03n|g/g:
              return ":cloud:";
            case /04n|g/g:
              return ":cloud:";
            case /09n|g/g:
              return ":white_sun_rain_cloud:";
            case /10n|g/g:
              return ":cloud_rain:";
            case /11n|g/g:
              return ":thunder_cloud_rain:";
            case /13n|g/g:
              return ":snowflake:";
            case /50n|g/g:
              return ":fog:";
          }
        };

        let weatherEmbed = new MessageEmbed()
          .setColor("BLURPLE")
          .setTitle(
            `${weatherIconMoji()} Weather in Maunula at ${new Date().toLocaleString(
              "en-FI",
              {
                hour: "numeric",
                minute: "numeric",
              }
            )}`
          )
          .setThumbnail(
            `https://openweathermap.org/img/wn/${weatherData.icon}@4x.png`
          )
          .setDescription(
            `**Weather report**: ${
              weatherData.description.charAt(0).toUpperCase() +
              weatherData.description.slice(1)
            }`
          )
          .addFields(
            {
              name: "Temperature",
              value: `${(json.main.temp - 273.15).toFixed(1)}°C`,
              inline: true,
            },
            {
              name: "Air pressure",
              value: `${json.main.pressure} hPa`,
              inline: true,
            },
            {
              name: "Air humidity",
              value: `${json.main.humidity}%`,
              inline: true,
            },
            {
              name: `Wind`,
              value: `**Speed**: ${
                json.wind.speed ? json.wind.speed : "no data"
              } m/s\n**Direction**: ${
                json.wind.deg ? json.wind.deg : "no data"
              }° ${windDirMoji()}`,
              inline: true,
            },
            {
              name: `Sunrise and sunset`,
              value: `${getDateEmoji(json.sys.sunrise)} ${new Date(
                json.sys.sunrise * 1000
              ).toLocaleString("en-FI", {
                hour: "numeric",
                minute: "numeric",
              })} - ${getDateEmoji(json.sys.sunset)} ${new Date(
                json.sys.sunset * 1000
              ).toLocaleString("en-FI", {
                hour: "numeric",
                minute: "numeric",
              })}`,
            }
          )
          .setFooter({
            text: `Last updated: ${new Date().toLocaleString("en-FI", {
              weekday: "long",
              day: "numeric",
              month: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}`,
          });

        interaction.reply({
          embeds: [weatherEmbed],
        });
      };

      weatherInfo();
    } catch (error) {
      console.error(error);
      interaction.reply(`:x: **Something went wrong...:**\n\`${error}\``);
    }
  },
};
