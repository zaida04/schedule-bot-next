/* eslint-disable radix */
import { Command } from "discord-akairo";
import { User, Message } from "discord.js";
import Log from "../../../database/Log";

export default class Hours extends Command {
    public constructor() {
        super("times-hours", {
            aliases: ["hours"],
            args: [
                {
                    id: "person",
                    type: "user",
                },
            ],
            category: "times",
            description: {
                content: "Get your total hours",
                usage: "[person]",
                example: ["", "@zaid"],
            },
        });
    }

    public async exec(message: Message, { person }: { person?: User }) {
        const user = person ?? message.author;

        const records = await Log.find({
            submitter: user.id,
        });

        let { hours, minutes } = records.reduce(
            (acc, curr) => {
                return {
                    hours: acc.hours + Number(curr.time.hours),
                    minutes: acc.minutes + Number(curr.time.minutes),
                };
            },
            { hours: 0, minutes: 0 }
        );

        hours += minutes % 60;
        minutes %= 60;

        return message.channel.send(
            `${
                user.id === message.author.id ? "You have" : `${user.tag} has`
            } tutored **${hours} hour(s)** and **${minutes} minute(s)**`
        );
    }
}
