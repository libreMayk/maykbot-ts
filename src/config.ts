import { ColorResolvable } from "discord.js";

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
  guildId: string;
  logChannelId: string;
  reactionMessages: IReactionMessage[];
  memberRoleId: string;
  colors: Colors;
  logoURL: string;
  hslLogoURL: string;
}

const config: IConfig = {
  token: process.env.TOKEN!,

  // Use info (Wont show debug logs), or Debug (Shows EVERYTHING)
  logLevel: "info",

  // these ids are required!
  suggestionsChannelId: process.env.SUGGESTIONS_CHANNEL_ID!,
  welcomeChannelId: process.env.WELCOME_CHANNEL_ID!,
  guildId: process.env.GUILD_ID!,
  logChannelId: process.env.LOG_CHANNEL_ID!,
  memberRoleId: process.env.MEMBER_ROLE_ID!,
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
  colors: {
    primary: "BLURPLE",
    success: "GREEN",
    error: "RED",
    warn: "YELLOW",
  },
  logoURL:
    "https://www.mayk.fi/wp-content/uploads/2017/06/pelkka%CC%88piiArtboard-2-150x150.png",
  hslLogoURL:
    "https://pbs.twimg.com/profile_images/574851566508732416/vwfmZj1S_400x400.png",
};

export default config;
