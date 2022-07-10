import {
  Collection,
  CommandInteraction,
  MessageAttachment,
  MessageEmbed,
} from "discord.js";
import config from "./config";

export const code = (string: string) => {
  return `\`${string}\``;
};

export const timeout = (seconds: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(undefined);
    }, seconds * 1000);
  });
};

interface QuestionOptions {
  ephemeral: boolean;
}

function askQuestion(
  interaction: CommandInteraction<"cached">,
  question: string
): Promise<string>;
function askQuestion(
  interaction: CommandInteraction<"cached">,
  question: string,
  options: Exclude<QuestionOptions, "noErr"> & { noErr: true }
): Promise<string | null>;

async function askQuestion(
  interaction: CommandInteraction<"cached">,
  question: string,
  { ephemeral }: QuestionOptions = { ephemeral: false }
) {
  const embed = new MessageEmbed()
    .setColor(config.colors.primary)
    .setDescription(question);

  if (ephemeral)
    await interaction.reply({
      embeds: [embed],
      ephemeral,
    });
  else
    await interaction.channel?.send({
      embeds: [embed],
    });

  try {
    const messages = await interaction.channel?.awaitMessages({
      filter: (m) => m.author.id === interaction.user.id,
      time: 60_000,
      max: 1,
    });
    const msg = messages?.first();

    if (msg?.content) return msg.content;
    return null;
  } catch (err) {
    return null;
  }
}
function formatAttachmentsURL(
  attachments: Collection<String, MessageAttachment>
) {
  let content: string = "";
  for (const file of attachments.values()) {
    content += file.url + "\n";
  }
  return content;
}

export default { askQuestion, formatAttachmentsURL, code };
