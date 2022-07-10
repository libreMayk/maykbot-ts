import {
  GuildMember,
  MessageEmbed,
  PartialGuildMember,
  TextChannel,
} from "discord.js";
import config from "../config";
import { Bot } from "../structures/Bot";
import { TypedEvent } from "../types";

export default TypedEvent({
  eventName: "guildMemberAdd",
  on: async (client: Bot, member: GuildMember | PartialGuildMember) => {
    if (member.partial) return;
    member.roles.add(config.memberRoleId);

    const welcomeMessageEmbed = new MessageEmbed()
      .setColor(config.colors.primary)
      .setTitle("New Member")
      .setDescription(
        `Welcome <@${member.id}> to the server, enjoy your stay!`
      );

    const welcomeChannel = client.channels.cache.get(
      config.welcomeChannelId
    ) as TextChannel;
    welcomeChannel.send({ embeds: [welcomeMessageEmbed] });
  },
});
