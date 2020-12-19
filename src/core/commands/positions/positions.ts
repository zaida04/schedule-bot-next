import { Flag, Command } from "discord-akairo";

export default class Positions extends Command {
    public constructor() {
        super("positions", {
            aliases: ["positions", "position"],
            category: "positions",
            description: {
                content: "Interact with this servers positions",
                usage: "<subcommand> [...args]",
                example: ["positions claim 243245"],
            },
        });
    }

    public *args() {
        const method = yield {
            type: [
                ["positions-create", "create"],
                ["positions-claim", "claim"],
                ["positions-delete", "delete"],
                ["positions-bump", "bump"],
            ],
            otherwise: `Your options for this sub-command are: create, claim, delete, and bump`,
        };

        return Flag.continue(method);
    }
}
