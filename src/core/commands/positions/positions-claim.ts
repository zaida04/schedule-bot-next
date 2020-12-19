import { Command } from "discord-akairo";
import { User } from "discord.js";
import { Message, MessageEmbed } from "discord.js";
import Position, { PositionSchema } from "../../../database/Position";

export default class claim extends Command {
    public constructor() {
        super("positions-claim", {
            aliases: ["claim"],
            args: [
                {
                    id: "id",
                    type: "string",
                    prompt: {
                        optional: true,
                        start: "What's the ID??",
                    },
                },
            ],
            category: "positions",
            description: {
                content: "Claim a position",
                usage: "<id>",
                example: ["claim 23894"],
            },
        });
    }

    public async exec(
        message: Message,
        { id, position, claimer }: { id: string; position?: PositionSchema; claimer?: User }
    ) {
        const event = (await Position.findById(id)) ?? position ?? null;
        const target = claimer ?? message.author;
        if (!event) return message.channel.send("That position does not exist.");
        if (event.taken) return message.channel.send("This position is already claimed.");
        const fetch_msg = await this.client.positions_channel.messages.fetch(event.msg_id);
        try {
            event.taken = true;
            event.claimer = target.id;
            await event.save();

            const promises = [];
            promises.push(fetch_msg.edit(`Claimed by ${target.toString()}`));
            promises.push(
                target.send(
                    "Please contact the parent at your earliest convenience. Be professional, concise, and to the point. Take your time with the child, and make sure you review the info in our info channel. Best of luck! If you have any questions, contact a board member.",
                    new MessageEmbed()
                        .setTitle("You have claimed a position.")
                        .setDescription(`Note: please CC ${this.client.config.email} in all emails.`)
                        .addField("Email To Contact", event.email)
                        .addField("The kid(s) name", event.student_name)
                        .addField("Description of Position", event.description)
                        .setFooter(`ID: ${event._id}`)
                )
            );
            return Promise.all(promises);
        } catch (e) {
            event.taken = false;
            event.claimer = "";
            void event.save();
            return message.channel.send("Error claiming that for you!");
        }
    }
}

/*
export default {
    name: "claim",
    usage: "<claim-id>",
    example: "972",
    description: "Claim a position",
    guildOnly: true,
    execute: async (message, [id]) => {
        if (!id) return message.channel.send("Must provide an id");
 
        );
    },
};
*/
