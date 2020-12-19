import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { MessageEmbed } from "discord.js";
import Position from "../../../database/Position";

export default class create extends Command {
    public constructor() {
        super("positions-create", {
            aliases: ["create"],
            args: [
                {
                    id: "student_name",
                    type: "lowercase",
                    prompt: {
                        start:
                            "What's the FULL name of the kid? (if multiple, separate FULL names with comma, Ex. John Doe, Jane Doe, Joe Mama)",
                    },
                },
                {
                    id: "email",
                    type: "string",
                    prompt: {
                        start: "What's the email of the kid(s)?",
                    },
                },

                {
                    id: "description",
                    type: "lowercase",
                    prompt: {
                        start: "What are the kid(s) looking to be taught?",
                    },
                },
            ],
            category: "positions",
            description: {
                content: "Create a position",
                usage: "<...args>",
                example: ["create"],
            },
            channel: "guild",
        });
    }

    public async exec(
        message: Message,
        { email, student_name, description }: { email: string; student_name: string; description: string }
    ) {
        const msg = await this.client.positions_channel.send(
            new MessageEmbed().setTitle("New Tutor Request").addField("Description", description)
        );

        const newPositions = await new Position({
            msg_id: msg.id,
            email: email,
            student_name: student_name,
            description: description,
            taken: false,
        }).save();

        await msg.edit(msg.embeds[0].setFooter(`To claim, press the ✋ reaction • ID: ${newPositions._id}`));

        void message.channel.send(
            new MessageEmbed()
                .setTitle("Event Created")
                // eslint-disable-next-line @typescript-eslint/no-base-to-string
                .setDescription(`Event created in: ${this.client.positions_channel.toString()}`)
                .addFields(
                    {
                        name: "ID",
                        value: newPositions._id,
                        inline: true,
                    },
                    {
                        name: "Link",
                        value: `[here](${msg.url})`,
                        inline: true,
                    },
                    {
                        name: "Created By",
                        value: message.author.tag,
                    }
                )
        );
        return msg.react("✋");
    }
}
