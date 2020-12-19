import { Command } from "discord-akairo";
import { User } from "discord.js";

import { Message } from "discord.js";
import Log, { LogSchema } from "../../../database/Log";
import { verifierOnly } from "../../util/verifierOnly";

export default class Reject extends Command {
    public constructor() {
        super("times-reject", {
            aliases: ["reject"],
            args: [
                {
                    id: "id",
                    type: "string",
                    prompt: {
                        optional: true,
                        start: "What's the id?",
                    },
                },
                {
                    id: "reason",
                    type: "string",
                    match: "rest",
                    prompt: {
                        optional: true,
                        start: "For what reason?",
                    },
                },
            ],
            category: "times",
            description: {
                content: "reject an open time",
                usage: "<id> [reason]",
                example: ["1234523 because you SUCK"],
            },
            channel: "guild",
            userPermissions: (m) => verifierOnly(m),
        });
    }

    public async exec(
        message: Message,
        { id, time, reason, executor }: { id: string; time?: LogSchema; reason: string; executor?: User }
    ) {
        const executor_main = executor ?? message.author;
        if (!reason) return message.channel.send("You must provide a reason to reject this.");
        const log = (await Log.findById(id)) ?? time ?? null;
        if (!log) return message.channel.send("Sorry, but that log doesn't exist.");

        log.verified = false;
        log.rejected = true;
        log.rejected_reason = reason;
        log.rejector = executor_main.id;
        void log.save();
        this.client.times_channel.messages
            .fetch(log.msg_id)
            .then((msg) =>
                Promise.all([
                    msg.edit(`This time has been REJECTED by ${executor_main.toString()}`),
                    msg.reactions.removeAll(),
                ])
            )
            .catch(() => null);
        void (await this.client.users.fetch(log.submitter).catch(() => null))
            ?.send(`Your time log has been REJECTED because \`${reason}\``)
            .catch(() => null);
        return executor ? void 0 : message.channel.send("Done.");
    }
}
