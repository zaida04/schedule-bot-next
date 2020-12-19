import { Command } from "discord-akairo";
import { User } from "discord.js";
import { MessageEmbed, Message } from "discord.js";
import Log, { LogSchema } from "../../../database/Log";
import { verifierOnly } from "../../util/verifierOnly";

export default class verify extends Command {
    public constructor() {
        super("times-verify", {
            aliases: ["verify"],
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
            category: "times",
            description: {
                content: "verify an open time",
                usage: "<id>",
                example: ["3242523"],
            },
            userPermissions: (m) => verifierOnly(m),
            channel: "guild",
        });
    }

    public async exec(message: Message, { id, time, executor }: { id: string; time?: LogSchema; executor?: User }) {
        const log = (await Log.findById(id)) ?? time ?? null;
        const doer = executor ?? message.author;
        if (!log) return message.channel.send("That Log does not exist.");
        if (log.verified)
            return message.channel.send(
                `This time has already been verified by ${(await message.client.users.fetch(log.verifier)).tag}`
            );

        const fetch_msg = await this.client.times_channel.messages.fetch(log.msg_id);

        void Promise.all([fetch_msg.edit(`Verified by ${doer.toString()}.`), fetch_msg.reactions.removeAll()]);

        log.verified = true;
        log.verifier = doer.id;

        await log.save();
        const submitter = await message.client.users.fetch(log.submitter).catch(() => null);
        if (submitter)
            void submitter.send(
                new MessageEmbed()
                    .setColor("GREEN")
                    .setDescription(
                        `Your time log with the id: ${log._id} with the time: ${log.time.hours} hours and ${
                            log.time.minutes
                        } minutes has been verifyed by ${doer.toString()}. Please screenshot this for your records`
                    )
            );
        return message.channel.send("Time verified.");
    }
}
