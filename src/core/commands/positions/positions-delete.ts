import { Command } from "discord-akairo";
import { Message } from "discord.js";
import Position from "../../../database/Position";

export default class Delete extends Command {
    public constructor() {
        super("positions-delete", {
            aliases: ["delete"],
            args: [
                {
                    id: "id",
                    type: "string",
                    prompt: {
                        start: "What's the ID?",
                    },
                },
            ],
            category: "positions",
            description: {
                content: "Delete a position",
                usage: "<id>",
                example: ["delete 23947"],
            },
        });
    }

    public async exec(message: Message, { id }: { id: string }) {
        const event = await Position.findById(id);
        if (!event) return message.channel.send("That position does not exist.");
        const fetch_msg = await this.client.positions_channel.messages.fetch(event.msg_id);
        void fetch_msg.delete();
        await event.delete();
        return message.channel.send("Event has been deleted");
    }
}
