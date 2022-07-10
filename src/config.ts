import { ColorResolvable, HexColorString } from "discord.js";

interface IReactionMessage {
  title: string;
  reactions: {
    [key: string]: {
      emoji: string;
    };
  };
}

interface Colors {
  primary: ColorResolvable;
  success: ColorResolvable;
  error: ColorResolvable;
  warn: ColorResolvable;
}

interface IConfig {
  token: string;
  logLevel: string;

  suggestionsChannelId: string;
  welcomeChannelId: string;
  announcementsChannelId: string;
  announcementsRoleId: string;
  guildId: string;
  logChannelId: string;
  reactionMessages: IReactionMessage[];
  memberRoleId: string;
  colors: Colors;
  logoURL: string;
}

const config: IConfig = {
  token: process.env.TOKEN!,

  // Use info (Wont show debug logs), or Debug (Shows EVERYTHING)
  logLevel: "info",

  suggestionsChannelId: "895008320090431489",
  announcementsChannelId: "875684745151926284",
  announcementsRoleId: "995394637655199804",
  welcomeChannelId: "875684745151926283",
  guildId: "875684744690532402",
  logChannelId: "896310843489267722",
  reactionMessages: [
    {
      title: "Marks",
      reactions: {
        cross: {
          emoji: "❌",
        },
        check: {
          emoji: "✅",
        },
      },
    },
  ],
  memberRoleId: "875685774052438037",
  colors: {
    primary: "BLURPLE",
    success: "GREEN",
    error: "RED",
    warn: "YELLOW",
  },
  logoURL:
    "https://www.mayk.fi/wp-content/uploads/2017/06/pelkka%CC%88piiArtboard-2-150x150.png",
};

export default config;
