import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import config from "../config";
import { IBotCommand } from "../types";
import axios from "axios";

export const command: IBotCommand = {
  data: new SlashCommandBuilder()
    .setName("hsl")
    .setDescription("All kinds of interesting data with HSL")
    .addSubcommand((subcommand) =>
      subcommand.setName("data").setDescription("Default HSL data.")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("realtime").setDescription("Real-time bus HSL data.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("search")
        .setDescription("Search HSL")
        .addStringOption((option) =>
          option
            .setName("query")
            .setDescription("Search query")
            .setRequired(true)
        )
    ),
  async execute(interaction: CommandInteraction<"cached">) {
    const hslEmbed = new MessageEmbed()
      .setColor("#007ac9")
      .setAuthor({
        name: "hsl.fi",
        iconURL: config.hslLogoURL,
        url: "https://hsl.fi/",
      })
      .setThumbnail(config.hslLogoURL)
      .setTitle("Helsingin Seudun Liikenne")
      .setDescription(`HSL - transporting and the relevant information`)
      .setTimestamp();

    if (interaction.options.getSubcommand() === "data") {
      await axios({
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        url: "https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql",
        data: '{"query":"{\\n  stopsByRadius(lat: 60.22984760837544, lon: 24.925459757586037, radius: 700) {\\n    edges {\\n      node {\\n        stop {\\n          name\\n          code\\n          gtfsId\\n          zoneId\\n          vehicleMode\\n          routes {\\n            shortName\\n            url\\n          }\\n        }\\n        distance\\n      }\\n    }\\n  }\\n}"}',
      })
        .then((response: any) => {
          const data = response.data;
          data.data.stopsByRadius.edges.map((element: any) => {
            if (element.node.stop.routes.length > 0) {
              const alueMoji = () => {
                return `:regional_indicator_${element.node.stop.zoneId.toLowerCase()}:`;
              };

              hslEmbed.addFields({
                name: `🚏 ${element.node.stop.name} (${element.node.stop.code})`,
                value: `${alueMoji()} **Zone:** ${
                  element.node.stop.zoneId
                }\n📍 **Distance:** ${
                  element.node.distance
                }m\n🚌 **Buses:** ${element.node.stop.routes
                  .map((route: any) => route.shortName)
                  .join(", ")}`,
                inline: false,
              });
            } else {
              hslEmbed.setDescription(`Ei ole pysäkkiä!`);
            }
          });
          interaction.reply({ embeds: [hslEmbed] });
        })
        .catch(function (error) {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            interaction.channel?.send(error.response.data);
            interaction.channel?.send(error.response.status);
            interaction.channel?.send(error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.message);
          }
          console.log(error.config);
        });
    } else if (interaction.options.getSubcommand() === "realtime") {
      await axios({
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        url: "https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql",
        data: `{\"query\":\"{\\n\\tnearest(\\n\\t\\tlat: 60.22984760837544\\n\\t\\tlon: 24.925459757586037\\n\\t\\tmaxDistance: 700\\n\\t\\tfilterByPlaceTypes: DEPARTURE_ROW\\n\\t) {\\n\\t\\tedges {\\n\\t\\t\\tnode {\\n\\t\\t\\t\\tplace {\\n\\t\\t\\t\\t\\t... on DepartureRow {\\n\\t\\t\\t\\t\\t\\tstop {\\n\\t\\t\\t\\t\\t\\t\\tname\\n\\t\\t\\t\\t\\t\\t\\tcode\\n\\t\\t\\t\\t\\t\\t\\tzoneId\\n\\t\\t\\t\\t\\t\\t}\\n\\t\\t\\t\\t\\t\\tstoptimes {\\n\\t\\t\\t\\t\\t\\t\\trealtimeDeparture\\n\\t\\t\\t\\t\\t\\t\\trealtimeArrival\\n\\t\\t\\t\\t\\t\\t\\trealtime\\n\\t\\t\\t\\t\\t\\t  departureDelay\\n\\t\\t\\t\\t\\t\\t\\ttrip {\\n\\t\\t\\t\\t\\t\\t\\t\\troute {\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tshortName\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tlongName\\n\\t\\t\\t\\t\\t\\t\\t\\t}\\n\\t\\t\\t\\t\\t\\t\\t}\\n\\t\\t\\t\\t\\t\\t\\theadsign\\n\\t\\t\\t\\t\\t\\t}\\n\\t\\t\\t\\t\\t}\\n\\t\\t\\t\\t}\\n\\t\\t\\t}\\n\\t\\t}\\n\\t}\\n}\\n\"}`,
      })
        .then((response) => {
          const data = response.data;
          const realtimeEmbed = new MessageEmbed()
            .setColor("#007ac9")
            .setAuthor({
              name: "hsl.fi",
              iconURL: config.hslLogoURL,
              url: "https://hsl.fi/",
            })
            .setThumbnail(config.hslLogoURL)
            .setTitle("Helsingin Seudun Liikenne")
            .setDescription(`HSL - real-time data`)
            .setTimestamp();

          data.data.nearest.edges.map((element: any) => {
            const alueMoji = () => {
              return `:regional_indicator_${element.node.place.stop.zoneId.toLowerCase()}:`;
            };

            const place = element.node.place;

            function toTime(time: any) {
              let hours = Math.floor(time / (60 * 60)) as any;
              time = time - hours * 60 * 60;
              let minutes = Math.floor(time / 60) as any;

              if (hours > 24) {
                hours = hours - 24;
              }
              if (hours === 0) {
                hours = "00";
              }
              if (minutes < 10) {
                minutes = "0" + minutes;
              }
              if (hours < 10) {
                hours = "0" + hours;
              }

              return hours + ":" + minutes;
            }

            place.stoptimes.map((stoptimes: any) => {
              if (stoptimes.realtime === true) {
                realtimeEmbed.addFields({
                  name: `🚏 ${place.stop.name} (${place.stop.code})`,
                  value: `${alueMoji()} **Zone:** ${
                    place.stop.zoneId ? place.stop.zoneId : "No zone data"
                  }\n🗺️ **Route:** ${place.stoptimes.map((stoptimes: any) => {
                    return stoptimes
                      ? stoptimes.trip.route.longName
                      : "No route data";
                  })}\n🚌 **Bus:** ${place.stoptimes.map((stoptimes: any) => {
                    return stoptimes
                      ? stoptimes.trip.route.shortName
                      : "No route data";
                  })} (${place.stoptimes.map((stoptimes: any) => {
                    return stoptimes ? stoptimes.headsign : "No bus";
                  })})\n🛬 **Arrival:** ${place.stoptimes.map(
                    (stoptimes: any) => {
                      return stoptimes
                        ? toTime(stoptimes.realtimeArrival)
                        : "No arrival time data";
                    }
                  )}\n⌛ **Departure delay:** ${place.stoptimes.map(
                    (stoptimes: any) => {
                      return stoptimes
                        ? `${Math.round(
                            stoptimes.departureDelay / 60
                          )}min ${Math.round(stoptimes.departureDelay % 60)}s`
                        : "No delay data";
                    }
                  )}`,
                  inline: false,
                });
              } else {
                return;
              }
            });
          });
          interaction.reply({ embeds: [realtimeEmbed] });
        })
        .catch((err) => {
          console.error(err);
          interaction.reply(`:x: **Something went wrong...**\n\`${err}\``);
          return;
        });
    } else if (interaction.options.getSubcommand() === "search") {
      const argsNew = interaction.options.getString("query");

      await axios({
        method: "get",
        url: `https://api.digitransit.fi/geocoding/v1/search?text=${argsNew}&size=1`,
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          const data = response.data;
          const element = data.features[0];

          if (!element || !element.properties) {
            interaction.reply(`:x: No such location found!`);
          } else {
            interface Properties {
              name: string;
              housenumber: string;
              street: string;
              postalcode: string;
              confidence: number;
              region: string;
              localadmin: string;
              locality: string;
              neighbourhood: string;
              label: string;
            }

            const prop: Properties = element.properties;

            const hslHakuEmbed = new MessageEmbed()
              .setColor("#007ac9")
              .setAuthor({
                name: "hsl.fi",
                iconURL: config.hslLogoURL,
                url: "https://hsl.fi/",
              })
              .setThumbnail(config.hslLogoURL)
              .setTitle(`Helsingin Seudun Liikenne`)
              .setDescription(
                `**Query:** [\`${argsNew}\`](https://reittiopas.hsl.fi/reitti/POS/${encodeURIComponent(
                  prop.label
                )})\n${prop.neighbourhood}, ${prop.localadmin}, ${prop.region}`
              )
              .addFields(
                {
                  name: `🏠 Address`,
                  value: `${prop.label}`,
                  inline: false,
                },
                {
                  name: `📍 Location`,
                  value: `${element.geometry.coordinates[1]}, ${element.geometry.coordinates[0]}`,
                  inline: false,
                }
              )
              .setTimestamp();

            interaction.reply({ embeds: [hslHakuEmbed] });
          }
        })
        .catch((err) => {
          console.error(err);
          interaction.reply(`:x: **Something went wrong...**\n\`${err}\``);
          return;
        });
    }
  },
};
