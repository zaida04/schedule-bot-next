import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import emojiRegex from "emoji-regex";
const regex = emojiRegex();

export default class Vote extends Command {
    public constructor() {
        super("vote", {
            aliases: ["vote"],
            args: [
                {
                    id: "description",
                    type: "string",
                    prompt: {
                        start: "what do you want to start a vote on? and no, it can't be for getting rid of me",
                    },
                },
            ],
            category: "util",
            description: {
                content: "start a vote",
                usage: "<...what to vote on>",
                example: ["vote should i eat pizza tonight?"],
            },
        });
    }

    public async exec(message: Message, { description }: { description: string }) {
        if (!description) return message.channel.send("You need to provide a description!");
        let match;
        const emojis = [];
        // eslint-disable-next-line no-cond-assign
        while ((match = regex.exec(message.content))) {
            const emoji = match[0];
            emojis.push(emoji);
        }

        const voteEmbed = new MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setTitle("Vote Started")
            .setDescription(
                `Please react with either of the two reactions at the bottom\n\n**Description**:\n${description}`
            )
            .setFooter(message.client.user!.username, message.client.user!.displayAvatarURL());
        const msg = await message.channel.send(voteEmbed);
        if (emojis.length > 1) {
            for (const emoji of emojis) {
                await msg.react(emoji);
            }
        } else {
            await msg.react("👍");
            await msg.react("👎");
        }
        void message.delete();
    }
}
