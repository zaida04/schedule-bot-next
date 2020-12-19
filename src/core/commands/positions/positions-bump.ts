import { Command } from "discord-akairo";

import { Message } from "discord.js";
import Position from "../../../database/Position";

export default class bump extends Command {
    public constructor() {
        super("positions-bump", {
            aliases: ["bump"],
            args: [
                {
                    id: "id",
                    type: "string",
                    prompt: {
                        optional: true,
                        start: "What's the ID?",
                    },
                },
            ],
            category: "positions",
            description: {
                content: "Bump a position.",
                usage: "<id>>",
                example: ["bump 2348"],
            },
            channel: "guild",
        });
    }

    public async exec(message: Message, { id }: { id: string }) {
        const event = await Position.findById(id);
        if (!event) return message.channel.send("That position does not exist.");
        if (event.taken) return message.channel.send("This position is already claimed.");

        const fetch_msg = await this.client.times_channel.messages.fetch(event.msg_id).catch(() => null);

        if (!fetch_msg)
            return message.channel.send("I couldn't find that position in the channel! Did you delete it??");
        void fetch_msg.delete();

        const newm = await this.client.times_channel.send(
            "THIS POSITION IS BEING BUMPED. If you do not have a student, feel free to claim",
            fetch_msg.embeds[0]
        );
        event.msg_id = newm.id;
        await event.save();
        void message.channel.send("Position has been bumped.");
    }
}

/*
export default {
    name: "bump",
    usage: "<claim-id>",
    example: "972",
    description: "Bump a position",
    execute: async (message, [id]) => {

    },
};
*/
