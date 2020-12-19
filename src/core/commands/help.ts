import { Category, Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { stripIndents } from "common-tags";
const ignoredCategories = ["owner", "default"];

export default class Help extends Command {
    public constructor() {
        super("help", {
            aliases: ["help", "h"],
            args: [
                {
                    id: "command",
                    type: "commandAlias",
                    default: null,
                },
            ],
            category: "util",
            description: {
                content: "Displays information about a command",
                usage: "[command]",
                example: ["help ban"],
            },
        });
    }

    public async exec(message: Message, { command }: { command?: Command }) {
        const prefix = this.client.config.PREFIX;
        const embed = new MessageEmbed().setColor("BLUE");

        if (command) {
            embed
                .addField("❯ Description", command.description.content || "No Description provided")
                .addField(
                    "❯ Usage",
                    `\`${prefix}${command.aliases[0]}${
                        command.description.usage ? ` ${command.description.usage as string}` : ""
                    }\``
                );

            if (command.description.example.length > 0)
                embed.addField(
                    "❯ Examples",
                    command.description.example.map((x: string) => `\`${prefix}${x}\``).join("\n")
                );

            if (command.aliases.filter((x: string) => x !== command.id).length > 1) {
                embed.addField(
                    "❯ Aliases",
                    `\`${command.aliases.filter((x: string) => x !== command.id).join("`, `")}\``
                );
            }

            if (command.userPermissions && Array.isArray(command.userPermissions)) {
                embed.addField("❯ Permissions Needed (from user)", `\`${command.userPermissions.join("`, `")}\``);
            }

            if (command.clientPermissions && Array.isArray(command.clientPermissions)) {
                embed.addField("❯ Permissions Needed (from me)", `\`${command.clientPermissions.join("`, `")}\``);
            }

            return message.channel.send(embed);
        }
        embed.setTitle("Commands").setDescription(
            stripIndents`
					A list of available commands.
                    For additional info on a command, type \`${prefix}help [command]\`
                    
                    **Legend:**
                    \`<arg>\` - required.
                    \`[arg]\` - optional.

					`
        );

        for (const cat of this.client.commandHandler.categories
            .filter((x: Category<string, Command>) => !ignoredCategories.includes(x.id))
            .sort(
                (a, b) =>
                    Number(b.reduce((acc: number, val) => acc + val.aliases.length)) -
                    Number(a.reduce((acc: number, val) => acc + val.aliases.length))
            )
            .values()) {
            const filteredCommands = cat.filter((cmd) => cmd.aliases.length > 0);
            embed.addField(
                `❯ ${cat.id.replace(/(\b\w)/gi, (lc) => lc.toUpperCase())}`,
                `${filteredCommands.map((cmd) => `\`${cmd.aliases[0]}\``).join(" ")}`,
                cat.filter((cmd) => cmd.aliases.length > 0).map((cmd) => `\`${cmd.aliases[0]}\``).length < 3
            );
        }
        /* if (cat.filter((cmd) => cmd.aliases.length > 0).size === 1)
                modules.push(cat.filter((cmd) => cmd.aliases.length > 0).first()!.aliases[0]);
            else {
                embed.addField(
                    `❯ ${cat.id.replace(/(\b\w)/gi, (lc) => lc.toUpperCase())}`,
                    `${cat
                        .filter((cmd) => cmd.aliases.length > 0)
                        .map((cmd) => `\`${cmd.aliases[0]}\``)
                        .join(" ")}`,
                    cat.filter((cmd) => cmd.aliases.length > 0).map((cmd) => `\`${cmd.aliases[0]}\``).length < 3
                );
            } */
        return message.channel.send(embed);
    }
}
