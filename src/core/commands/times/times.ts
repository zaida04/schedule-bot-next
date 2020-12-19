import { Flag, Command } from "discord-akairo";

export default class Times extends Command {
    public constructor() {
        super("times", {
            aliases: ["times", "time"],
            category: "times",
            description: {
                content: "Interact with this servers time logs",
                usage: "<subcommand> [...args]",
                example: ["times log", "times verify 2139"],
            },
        });
    }

    public *args() {
        const method = yield {
            type: [
                ["times-log", "log"],
                ["times-reject", "reject"],
                ["times-verify", "verify"],
                ["times-delete", "delete"],
                ["times-hours", "hours"],
            ],
            otherwise: `Your options for this sub-command are: log, reject, verify, hours, and delete`,
        };

        return Flag.continue(method);
    }
}
